import json,pathlib,hashlib
p=pathlib.Path('.'); sources=json.load(open('artifacts/ch03-interview/source-index.json'))[:5]
base=json.load(open('artifacts/ch03-interview/prepublish-20260918-m01-m05.json'))
keys={c['canonical_key'] for c in base['cards']};cards=[]
for n in range(1,6):cards+=json.load(open(f'content/batches/ch03-interview-20260917-m0{n}.json'))['cards']
assert len({c['canonical_key'] for c in cards})==len(cards)
keys|={c['canonical_key'] for c in cards}
relations=[];total=0
for n,s in enumerate(sources,1):
 assert hashlib.sha256(pathlib.Path(s['absolute_path']).read_bytes()).hexdigest()==s['content_hash']
 d=json.load(open(f'docs/card-production/ch03-interview/m0{n}-coverage.json'));objs=d['objectives'];assert len(objs)==len(s['checklist'])
 lines=[]
 for o in objs:
  ref=o.get('source_ref',o.get('source',{}));line=o.get('source_line',ref.get('line_start',ref.get('line')));lines.append(line)
  text=o.get('original_text',o.get('original'));assert text==next(x['text'] for x in s['checklist'] if x['line']==line),(n,line)
  for k in o['card_keys']:assert k in keys,(n,k)
 assert len(set(lines))==len(lines);total+=len(objs)
 r=json.load(open(f'docs/card-production/ch03-interview/m0{n}-relations.json'));relations+=r if isinstance(r,list) else r['relations']
seen=set();unique=[];graph={}
for r in relations:
 a,b,t=r['from'],r['to'],r['type'];assert a in keys and b in keys,(a,b);assert a!=b;assert t in ['prerequisite','compare','extension']
 identity=(a,b,t)
 if identity in seen:continue
 seen.add(identity);unique.append(r)
 if t=='prerequisite':graph.setdefault(a,[]).append(b)
def visit(k,path):
 assert k not in path,('cycle',k)
 for b in graph.get(k,[]):visit(b,path|{k})
for k in graph:visit(k,set())
pathlib.Path('content/ch03-knowledge-map.json').write_text(json.dumps(dict(version=1,updated_at='2026-09-18',relations=unique),ensure_ascii=False,indent=2)+'\n')
print(json.dumps(dict(passed=True,objectives=total,cards=len(cards),revisions=sum(c['revision']==2 for c in cards),new=sum(c['revision']==1 for c in cards),relations=len(unique))))
