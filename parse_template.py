import json

data = json.load(open('template_dump.json', encoding='utf-8'))
with open('template_summary.txt', 'w', encoding='utf-8') as out:
    for s in data:
        out.write(f"=== SLIDE {s['slide_num']} ===\n")
        for sh in s['shapes']:
            if 'paragraphs' in sh:
                txts = [p.strip() for p in sh['paragraphs'] if p.strip()]
                if txts:
                    out.write(f"  [Shape {sh['shape_id']} ({sh['name']})]:\n")
                    for t in txts:
                        out.write(f"    - {t}\n")
            if 'table' in sh:
                out.write(f"  [Table {sh['shape_id']}]:\n")
                for r in sh['table']:
                    out.write(f"    {r}\n")
        out.write('\n')
print('Written template_summary.txt')
