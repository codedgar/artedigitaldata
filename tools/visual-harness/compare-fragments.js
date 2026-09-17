// Compara fragmentos de HTML "antes" contra la salida de un componente.
// Sirve para lo que las capturas de página no ven: estados de carga, vacíos,
// errores, modales abiertos, vistas de usuario logueado.
//
//   node tools/visual-harness/compare-fragments.js <casos.js>
//
// <casos.js> exporta un array de casos:
//   {
//     name: 'obras-empty',
//     before: '<div class="col-span-full ...">...</div>',   // HTML literal de HEAD
//     after: () => UI.EmptyState({ ... }).toString(),       // corre en el navegador
//     wrapper: '<div class="grid grid-cols-3 gap-6" style="width:1200px">{}</div>', // opcional
//     scripts: ['js/ui/state.js'],                           // JS de public/ a cargar
//     viewport: { width: 1440, height: 900 },                // opcional
//     hover: '.ui-btn',                                      // opcional: selector a hover antes de capturar
//     focus: 'input',                                        // opcional: selector a enfocar antes de capturar
//   }
//
// Falla (exit 1) si algún caso difiere en píxeles o en estilos computados.
// Carga public/ del working tree (o HARNESS_ROOT) con los mismos CSS que las
// páginas: font-awesome del netcache, css/style.css y css/tailwind.css. El
// `before` usa style.css y tailwind.css de FRAGMENTS_BEFORE_REF (75d8386).
const fs = require('fs');
const { execFileSync } = require('child_process');
const path = require('path');
const { chromium } = require('playwright');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');
const { start } = require('./server');
const netcache = require('./netcache');

const FA = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
// Sin auth.js a propósito: redirige al SSO y un componente no debe depender
// de la sesión (los datos de usuario le llegan por props).
const BASE_SCRIPTS = ['js/config.js', 'js/ui/core.js'];

// El `before` se pinta con el CSS del commit previo a la migración y el `after`
// con el del working tree. Con un solo build, una utilidad que la migración
// dejó de usar en todo el markup (p. ej. `outline-none`) desaparecía del CSS
// y el HTML viejo se veía roto aunque la página real no cambiara.
const BEFORE_REF = process.env.FRAGMENTS_BEFORE_REF || '75d8386';
const beforeCss = {};
function cssAt(file) {
  if (!(file in beforeCss)) {
    beforeCss[file] = execFileSync('git', ['show', `${BEFORE_REF}:public/css/${file}`], {
      cwd: path.resolve(__dirname, '../..'),
      maxBuffer: 64 * 1024 * 1024,
    });
  }
  return beforeCss[file];
}

function shell(scripts, cssBase) {
  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<link rel="stylesheet" href="${FA}">
<link rel="stylesheet" href="${cssBase}/style.css">
<link rel="stylesheet" href="${cssBase}/tailwind.css">
${[...BASE_SCRIPTS, ...scripts].map((s) => `<script src="/${s}"></script>`).join('\n')}
<style>/* el caret parpadea y ensucia el diff de los casos con focus */ #root * { caret-color: transparent !important; }</style>
</head><body class="min-h-screen"><div id="root" style="padding:24px"></div></body></html>`;
}

// Estilos computados de cada elemento, en orden de documento. Si la estructura
// cambia (distinta cantidad de elementos o tags) se informa como diferencia.
async function computed(page) {
  return page.evaluate(() => {
    const els = [...document.querySelectorAll('#root *')];
    return els.map((el) => {
      const cs = getComputedStyle(el);
      const out = { tag: el.tagName };
      // Las custom properties (`--color-cyan`) se omiten: el build viejo y el
      // minificado escriben el mismo valor con otro formato (#00F5FF vs #00f5ff),
      // y lo que importa ya aparece resuelto en las propiedades reales.
      for (let i = 0; i < cs.length; i++) {
        if (!cs[i].startsWith('--')) out[cs[i]] = cs.getPropertyValue(cs[i]);
      }
      out.text = el.childNodes.length === 1 && el.firstChild.nodeType === 3 ? el.textContent : undefined;
      return out;
    });
  });
}

async function render(browser, origin, c, markup, side) {
  const context = await browser.newContext({
    viewport: c.viewport || { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    locale: 'es-AR',
    timezoneId: 'America/Argentina/Buenos_Aires',
  });
  await netcache.attach(context, { record: false });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  const cssBase = side === 'before' ? '/__before/css' : '/css';
  await page.route(`${origin}/__fragment`, (route) =>
    route.fulfill({ status: 200, contentType: 'text/html', body: shell(c.scripts || [], cssBase) })
  );
  await page.route(`${origin}/__before/css/*`, (route) =>
    route.fulfill({ status: 200, contentType: 'text/css', body: cssAt(path.basename(new URL(route.request().url()).pathname)) })
  );
  await page.goto(`${origin}/__fragment`, { waitUntil: 'load' });
  const html = typeof markup === 'function'
    ? await page.evaluate(`(${markup.toString()})()`)
    : markup;
  const wrapped = (c.wrapper || '{}').replace('{}', html);
  await page.evaluate((w) => { document.getElementById('root').innerHTML = w; }, wrapped);
  await page.evaluate(() => document.fonts.ready);
  if (c.focus) await page.focus(`#root ${c.focus}`).catch((e) => errors.push(`focus: ${e.message}`));
  if (c.hover) await page.hover(`#root ${c.hover}`).catch((e) => errors.push(`hover: ${e.message}`));
  await page.evaluate(() => {
    for (const a of document.getAnimations()) { a.pause(); a.currentTime = 0; }
  });
  // Primero los estilos: la captura con `animations: 'disabled'` reinicia las
  // animaciones infinitas al terminar y el transform del spinner quedaría a mitad.
  const styles = await computed(page);
  const shot = PNG.sync.read(await page.locator('#root').screenshot({ animations: 'disabled' }));
  await context.close();
  return { shot, styles, errors, html };
}

function diffStyles(a, b) {
  if (a.length !== b.length) return [`cantidad de elementos: ${a.length} vs ${b.length}`];
  const out = [];
  a.forEach((ea, i) => {
    const eb = b[i];
    for (const k of new Set([...Object.keys(ea), ...Object.keys(eb)])) {
      if (ea[k] !== eb[k]) out.push(`#${i} <${ea.tag.toLowerCase()}> ${k}: ${JSON.stringify(ea[k])} -> ${JSON.stringify(eb[k])}`);
    }
  });
  return out;
}

async function main() {
  const file = process.argv[2];
  if (!file) throw new Error('Uso: node compare-fragments.js <casos.js>');
  const cases = require(path.resolve(file));
  const outDir = path.resolve(__dirname, 'snapshots', `fragments-${path.basename(file, '.js')}`);
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  const { server, origin } = await start();
  const browser = await chromium.launch();
  let failed = 0;

  for (const c of cases) {
    const a = await render(browser, origin, c, c.before, 'before');
    const b = await render(browser, origin, c, c.after, 'after');
    const problems = [...a.errors.map((e) => `error antes: ${e}`), ...b.errors.map((e) => `error después: ${e}`)];

    if (a.shot.width !== b.shot.width || a.shot.height !== b.shot.height) {
      problems.push(`tamaño: ${a.shot.width}x${a.shot.height} -> ${b.shot.width}x${b.shot.height}`);
    } else {
      const diff = new PNG({ width: a.shot.width, height: a.shot.height });
      const n = pixelmatch(a.shot.data, b.shot.data, diff.data, a.shot.width, a.shot.height, { threshold: 0 });
      if (n) {
        problems.push(`${n} píxeles distintos`);
        fs.writeFileSync(path.join(outDir, `${c.name}--diff.png`), PNG.sync.write(diff));
      }
    }
    problems.push(...diffStyles(a.styles, b.styles).slice(0, 15));

    fs.writeFileSync(path.join(outDir, `${c.name}--before.png`), PNG.sync.write(a.shot));
    fs.writeFileSync(path.join(outDir, `${c.name}--after.png`), PNG.sync.write(b.shot));

    if (problems.length) {
      failed++;
      console.log(`✗ ${c.name}\n    ${problems.join('\n    ')}\n    salida: ${b.html.slice(0, 300)}`);
    } else {
      console.log(`✓ ${c.name}`);
    }
  }

  await browser.close();
  server.close();
  console.log(`\n${cases.length - failed}/${cases.length} idénticos -> snapshots/${path.basename(outDir)}`);
  process.exit(failed ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
