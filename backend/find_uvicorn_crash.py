import subprocess

try:
    print('Starting uvicorn test...')
    output = subprocess.check_output(
        ['python', '-m', 'uvicorn', 'app.main:app', '--port', '8000'],
        stderr=subprocess.STDOUT,
        timeout=18
    )
except subprocess.CalledProcessError as e:
    with open('crash.txt', 'w') as f:
        f.write(e.output.decode('utf-8', errors='replace'))
    print('Uvicorn crashed. Wrote to crash.txt')
except subprocess.TimeoutExpired:
    print('Uvicorn successfully stayed alive for 18 seconds!')
