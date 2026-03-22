import re

with open(r'c:\Users\User\Desktop\Second Year Stuff\sdgp\PathFinder+\Adjusted_Scraper\project_root\frontend\pathfinder_frontend\app\mentor-dashboard\page.tsx', 'r') as f:
    lines = f.readlines()

def check_brackets(lines):
    stack = []
    for i, line in enumerate(lines):
        line = line.split('//')[0] # remove comments roughly
        # count <div and </div
        opens = len(re.findall(r'<div\b[^>]*>', line))
        closes = len(re.findall(r'</div\s*>', line))
        
        for _ in range(opens): stack.append(i+1)
        for _ in range(closes):
            if stack: stack.pop()
            else: print(f"Extra closing div at line {i+1}")
            
    print("Unclosed div tags opened at lines:", stack)

    # Count braces too
    brace_stack = []
    for i, line in enumerate(lines):
        for char in line:
            if char == '{': brace_stack.append(i+1)
            elif char == '}':
                if brace_stack: brace_stack.pop()
                else: print(f"Extra closing brace at line {i+1}")
    print("Unclosed braces opened at lines:", brace_stack)

check_brackets(lines)
