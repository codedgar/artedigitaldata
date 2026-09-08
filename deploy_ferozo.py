import ftplib
import io
import os
import sys

FTP_HOST = 'c1700065.ferozo.com'
FTP_USER = 'jpupper@jeyder.com.ar'
FTP_PASS = 'Sarosa2025'

def ensure_dir(ftp, path):
    parts = path.strip('/').split('/')
    current = ''
    for part in parts:
        if not part:
            continue
        current += '/' + part
        try:
            ftp.cwd(current)
        except:
            ftp.mkd(current)
            ftp.cwd(current)

def upload_file(ftp, local_path, remote_path):
    with open(local_path, 'rb') as f:
        data = f.read()
    buf = io.BytesIO(data)
    remote_dir = '/'.join(remote_path.split('/')[:-1])
    ensure_dir(ftp, remote_dir)
    ftp.cwd('/')
    ftp.storbinary(f'STOR {remote_path}', buf)
    try:
        size = ftp.size(remote_path)
        ok = size == len(data)
        print(f'  {remote_path}: {len(data)} bytes {"OK" if ok else f"SIZE MISMATCH ({size})"}')
    except Exception as e:
        print(f'  {remote_path}: {len(data)} bytes (size check: {e})')

if len(sys.argv) < 2:
    print("Usage: python deploy_ferozo.py <file1> [file2] ...")
    sys.exit(1)

files_to_upload = sys.argv[1:]

print("Connecting to Ferozo FTP...")
try:
    ftp = ftplib.FTP_TLS(FTP_HOST)
    ftp.login(FTP_USER, FTP_PASS)
    ftp.prot_p()
    print("Connected!")
    
    print('\n--- Uploading to /artedigitaldata/ ---')
    for local_path in files_to_upload:
        filename = os.path.basename(local_path)
        remote_path = f'artedigitaldata/{filename}'
        upload_file(ftp, local_path, remote_path)
    
    ftp.quit()
    print("\nAll files uploaded successfully!")
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
