import json,pathlib,hashlib,argparse
a=argparse.ArgumentParser()
a.add_argument("--first",type=int,default=6);a.add_argument("--last",type=int,default=10)
a.add_argument("--snapshot",default="artifacts/ch03-interview/prepublish-20261001-m06-m10.json")
a.add_argument("--batch-date",default="20260922");a.add_argument("--manifest");opts=a.parse_args()
assert 1<=opts.first<=opts.last<=26
p=pathlib.Path('.'); sources=json.load(open(opts.manifest)) if opts.manifest else json.load(open('artifacts/ch03-interview/source-index.json'))[opts.first-1:opts.last]
for n,s in enumerate(sources,opts.first):
 s.setdefault('batch_path',f'content/batches/ch03-interview-{opts.batch_date}-m{n:02}.json')
 s.setdefault('coverage_path',f'docs/card-production/ch03-interview/m{n:02}-coverage.json')
 s.setdefault('relations_path',f'docs/card-production/ch03-interview/m{n:02}-relations.json')
base=json.load(open(opts.snapshot))
keys={c['canonical_key'] for c in base['cards']};cards=[]
for s in sources:cards+=json.load(open(s['batch_path']))['cards']
assert len({c['canonical_key'] for c in cards})==len(cards)
keys|={c['canonical_key'] for c in cards}
relations=json.load(open('content/ch03-knowledge-map.json'))['relations'];total=0;documented=0
for n,s in enumerate(sources,opts.first):
 assert hashlib.sha256(pathlib.Path(s['absolute_path']).read_bytes()).hexdigest()==s['content_hash']
 d=json.load(open(s['coverage_path']));objs=d['objectives'];assert objs or s['checklist'];native=[];documented+=len(objs)
 source_lines=pathlib.Path(s['absolute_path']).read_text().split('\n')
 for o in objs:
  if not s['checklist']:
   assert o.get('source_type') or o.get('origin'),(n,'missing source type')
  if o.get('source_type') in ['正文明确问题','章末明确问题']:
   assert source_lines[o['source_line']-1].strip()==o['original_text'].strip(),(n,o['source_line'],'question mismatch')
 lines=[]
 for o in objs:
  ref=o.get('source_ref',o.get('source',{}));line=o.get('source_line',ref.get('line_start',ref.get('line')));lines.append(line)
  text=o.get('original_text',o.get('original'));assert isinstance(text,str) and text.strip(),(n,line,'empty objective');assert line and 1<=line<=s['line_count'],(n,line)
  if text in [x['text'] for x in s['checklist']] and o.get('source_type')!='跨模块/编辑补题':
   assert text==next(x['text'] for x in s['checklist'] if x['line']==line),(n,line);native.append(line)
  for k in o['card_keys']:assert k in keys,(n,k)
 assert set(native)=={x['line'] for x in s['checklist']},(n,'missing native objective')
 assert len(native)==len(s['checklist']);total+=len(native)
 r=json.load(open(s['relations_path']));relations+=r if isinstance(r,list) else r['relations']
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
pathlib.Path('content/ch03-knowledge-map.json').write_text(json.dumps(dict(version=1,updated_at='2026-10-02',relations=unique),ensure_ascii=False,indent=2)+'\n')
print(json.dumps(dict(passed=True,objectives=total,documented_objectives=documented,cards=len(cards),revisions=sum(c['revision']==2 for c in cards),new=sum(c['revision']==1 for c in cards),relations=len(unique))))
