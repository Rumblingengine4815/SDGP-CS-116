import os
import re

file_path = r"c:\Users\User\Desktop\Second Year Stuff\sdgp\PathFinder+\Adjusted_Scraper\project_root\frontend\pathfinder_frontend\app\mentor-dashboard\page.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace hardcoded backgrounds
content = content.replace("bg-transparent", "bg-pf-purple-50")
content = re.sub(r'bg-content1/80\s+backdrop-blur-xl', 'bg-white border-b border-pf-border', content)

# Remove dark mode variants
content = re.sub(r'dark:[^\s"\'`]+', '', content)

# Replace remaining zinc/gray inputs to pure semantic tokens
content = content.replace("bg-zinc-800", "bg-content2")
content = content.replace("border-zinc-700", "border-divider")
content = content.replace("text-gray-900", "text-foreground")
content = content.replace("text-gray-600", "text-default-600")
content = content.replace("text-gray-500", "text-default-500")
content = content.replace("text-gray-400", "text-default-400")
content = content.replace("border-gray-200", "border-pf-border")
content = content.replace("text-slate-400", "text-default-400")

# Note: Removed the whitespace collapse line that broke ASI and caused the compiler to crash

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Dashboard refactored without breaking multiline JSX.")
