// Candado global del harness. Cada captura levanta un Chromium que usa varios
// GB; dos o tres en paralelo (varios agentes trabajando a la vez) dejaban a la
// máquina sin memoria y el sistema mataba los procesos. Con esto las corridas
// esperan su turno. Sólo lo toma capture.js: compare-fragments.js abre una
// página chica por caso y no pesa, y bloquearlo detrás de una captura completa
// (40 minutos) dejaba a los agentes esperando para chequeos de segundos.
const fs = require('fs');
const path = require('path');

const LOCK_DIR = path.resolve(__dirname, 'snapshots', '.lock');

function holderAlive() {
  try {
    const pid = Number(fs.readFileSync(path.join(LOCK_DIR, 'pid'), 'utf8'));
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

async function acquire(label) {
  fs.mkdirSync(path.dirname(LOCK_DIR), { recursive: true });
  let waited = false;
  for (;;) {
    try {
      // mkdir es atómico: si dos procesos compiten, sólo uno lo crea.
      fs.mkdirSync(LOCK_DIR);
      fs.writeFileSync(path.join(LOCK_DIR, 'pid'), String(process.pid));
      fs.writeFileSync(path.join(LOCK_DIR, 'label'), label);
      break;
    } catch (e) {
      if (e.code !== 'EEXIST') throw e;
      // Un proceso que murió sin liberar deja el candado huérfano. Si todavía
      // no escribió su pid (recién creado) se lo respeta y se espera.
      if (fs.existsSync(path.join(LOCK_DIR, 'pid')) && !holderAlive()) {
        fs.rmSync(LOCK_DIR, { recursive: true, force: true });
        continue;
      }
      if (!waited) {
        let who = '?';
        try { who = fs.readFileSync(path.join(LOCK_DIR, 'label'), 'utf8'); } catch {}
        console.log(`[harness] esperando turno (ocupado por: ${who})...`);
        waited = true;
      }
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
  const release = () => {
    try {
      if (fs.readFileSync(path.join(LOCK_DIR, 'pid'), 'utf8') === String(process.pid)) {
        fs.rmSync(LOCK_DIR, { recursive: true, force: true });
      }
    } catch {}
  };
  process.on('exit', release);
  for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => { release(); process.exit(1); });
}

module.exports = { acquire };
