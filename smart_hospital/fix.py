import os

directory = 'c:/Users/youna/Desktop/hoos/smart_hospital'
for root, _, files in os.walk(directory):
    for f in files:
        if f.endswith(('.ts', '.tsx', '.sql', '.md')):
            path = os.path.join(root, f)
            if 'node_modules' in path:
                continue
            with open(path, 'r', encoding='utf-8') as file:
                content = file.read()
            if '\\n' in content or '\\"' in content:
                decoded = content.replace('\\n', '\n').replace('\\"', '"')
                with open(path, 'w', encoding='utf-8') as file:
                    file.write(decoded)
