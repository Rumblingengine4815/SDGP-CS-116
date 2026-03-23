import os, subprocess, re

files = subprocess.check_output(['git', 'diff', '--name-only', '--diff-filter=U']).decode('utf-8').splitlines()

out = ''
for f in files:
    if not os.path.exists(f): continue
    try:
        content = open(f, 'r', encoding='utf-8').read()
    except:
        continue
    blocks = re.findall(r'(<<<<<<< HEAD.*?=======\n.*?(?:>>>>>>> [^\n]+))', content, re.DOTALL)
    if blocks:
        out += f"\n=== {f} ===\n"
        for i, b in enumerate(blocks):
            out += f"\n[Conflict {i+1}]\n{b}\n"

with open('conflict_report.txt', 'w', encoding='utf-8') as fh:
    fh.write(out)
