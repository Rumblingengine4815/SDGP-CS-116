import ast
import json

file_path = r"c:\Users\User\Desktop\Second Year Stuff\sdgp\PathFinder+\Adjusted_Scraper\project_root\Machine Learning and Data Cleaning\core\recommendation_engine.py"

with open(file_path, "r", encoding="utf-8") as f:
    source = f.read()

tree = ast.parse(source)

class MethodVisitor(ast.NodeVisitor):
    def __init__(self):
        self.methods = []
        
    def visit_FunctionDef(self, node):
        self.methods.append({
            "name": node.name,
            "line": node.lineno,
            "end_line": node.end_lineno
        })
        self.generic_visit(node)

visitor = MethodVisitor()
visitor.visit(tree)

# Group by name
name_map = {}
for m in visitor.methods:
    name_map.setdefault(m["name"], []).append(m)

duplicates = {k: v for k, v in name_map.items() if len(v) > 1}

report = []
report.append(f"Total methods: {len(visitor.methods)}")
report.append("\nDUPLICATE METHODS (V1 vs V3 Gold Clashes):")
for name, occurrences in duplicates.items():
    report.append(f"\nMethod: {name}")
    for o in occurrences:
        report.append(f"  - Lines {o['line']} to {o['end_line']}")

with open("ast_report.txt", "w") as f:
    f.write("\n".join(report))
