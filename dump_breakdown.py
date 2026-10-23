import json

data = json.load(open('full_template_details.json', encoding='utf-8'))

with open('slide_breakdown.txt', 'w', encoding='utf-8') as f:
    for s in data:
        idx = s['slide_index'] + 1
        f.write(f"\n{'='*30} SLIDE {idx} {'='*30}\n")
        for sh in s['shapes']:
            name = sh['name']
            text = sh.get('text', '').strip()
            table = sh.get('table_rows')
            if text:
                f.write(f"  Shape {sh['index']} [{name}]:\n")
                for line in text.split('\n'):
                    if line.strip():
                        f.write(f"    {line.strip()}\n")
            elif table:
                f.write(f"  Shape {sh['index']} [{name}] TABLE ({len(table)} rows):\n")
                for row in table:
                    f.write(f"    {row}\n")
            else:
                # Shape without text (e.g., background rectangle, icon, line)
                f.write(f"  Shape {sh['index']} [{name}] (geom: w={sh['width']}, h={sh['height']})\n")

print("Wrote slide_breakdown.txt")
