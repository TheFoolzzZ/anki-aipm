import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { createHash } from 'node:crypto';
import { environment } from './env';

export function stableId(key: string) {
  const h = createHash('sha256').update(`recall-studio:${key}`).digest('hex');
  return `${h.slice(0,8)}-${h.slice(8,12)}-5${h.slice(13,16)}-a${h.slice(17,20)}-${h.slice(20,32)}`;
}
const descriptions = [
  ['从问题出发','理解产品经理的角色，在真实问题中建立基本功。','#AAC9E8',20,'Compass'],
  ['找到你的坐标','从职责、能力到交付，建立 AI PM 的完整视野。','#BEB4E1',25,'Orbit'],
  ['看懂智能的底层','从模型到 Agent，将技术概念变成产品判断。','#AACBF8',180,'Cpu'],
  ['让想法变成作品','用 AI 快速验证想法，也学会判断成果是否可靠。','#C4D4AD',15,'Code2'],
  ['设计可交付的智能','在需求、成本、体验与风险之间，做出有依据的选择。','#E8C4A6',55,'Layers'],
  ['走进真实场景','拆解知识库、客服与编程 Agent，练习迁移。','#B3D9D5',30,'Boxes'],
  ['让价值持续发生','从单位经济到商业模式，看懂产品为什么能成立。','#DAB8CF',20,'ChartNoAxesCombined'],
  ['保持判断力','带着时间与证据阅读行业变化，提出自己的看法。','#CEC4AD',0,'MessageCircle'],
  ['换一个角度思考','从日常现象里，练习目标、机制、权衡与证据。','#BDBAD9',15,'Lightbulb'],
];
const root = environment().KB_SOURCE_PATH;
if (!root) throw new Error('KB_SOURCE_PATH is required');
const chapters: any[] = [], lessons: any[] = [], sources: any[] = [];
const folders = readdirSync(root).filter(n => /^第\d+章/.test(n)).sort((a,b)=>a.localeCompare(b,'zh',{numeric:true}));
for (const folder of folders) {
  const chapter = Number(folder.match(/^第(\d+)章/)![1]);
  const [subtitle,description,color,target_cards,icon] = descriptions[chapter-1];
  const chapterId = stableId(`chapter:${chapter}`);
  chapters.push({id:chapterId,position:chapter,title:folder.replace(/^第\d+章-/,'').replace('Ai','AI'),subtitle,description,color,target_cards,icon});
  const files = readdirSync(join(root,folder)).filter(n=>n.endsWith('.md')).sort((a,b)=>a.localeCompare(b,'zh',{numeric:true}));
  for (const [index,file] of files.entries()) {
    const key = `${folder}/${file}`;
    const body = readFileSync(join(root,folder,file),'utf8');
    const hash = createHash('sha256').update(body).digest('hex');
    const title = (body.match(/^# (.+)/m)?.[1] || file.replace('.md','')).replace(/^\d+\.\d+\s*/, '');
    const id = stableId(`lesson:${key}`);
    // Exclude code-fenced headings; the original knowledge base contains prompt examples.
    let fence = ''; const headings: {text:string;level:number}[] = [];
    for (const line of body.split('\n')) {
      const marker=line.match(/^\s*(`{3,}|~{3,})/);
      if(marker){ if(!fence)fence=marker[1][0];else if(marker[1][0]===fence)fence='';continue; }
      const h=line.match(/^(#{2,3})\s+(.+)/);
      if(!fence&&h)headings.push({level:h[1].length,text:h[2].replace(/\*\*/g,'')});
    }
    const clean = body.split('\n').filter(l=>l.trim().length>45&&!/^[#>|!\[\-`~]/.test(l.trim())).slice(0,2).join(' ').replace(/\*\*/g,'').replace(/\[[^\]]*\]\([^)]*\)/g,'').slice(0,180);
    lessons.push({id,chapter_id:chapterId,title,position:index+1,source_key:key,summary:clean||String(description),reading_minutes:Math.max(2,Math.round(body.length/700)),headings});
    sources.push({id:stableId(`source:${key}:${hash}`),lesson_id:id,content_hash:hash,relative_path:relative(root,join(root,folder,file)),body_markdown:body});
  }
}
const design=readFileSync('docs/plans/2026-09-05-curriculum-and-cards.md','utf8');
const blocks=[...design.matchAll(/^### (C\d+) · (.+)\n([\s\S]*?)(?=^### C\d+|^## 7\.)/gm)];
const homeCodes=['3.11','3.11','3.11','3.23','3.11','3.17','3.17','3.19','3.25','3.25','3.25','5.1','5.5','3.25'];
const cards:any[]=[], revisions:any[]=[];
for(const [i,m] of blocks.entries()){
 const block=m[3];
 const field=(name:string)=>block.match(new RegExp(`^- \\*\\*${name}\\*\\*：(.+)`,'m'))?.[1]||'';
 const link=block.match(/\]\(kb:\/\/([^)]+\.md):(\d+)\)/);
 if(!link)throw new Error(`Missing source for ${m[1]}`);
 const path=link[1];
 const source=sources.find(s=>s.relative_path===path);
 const home=lessons.find(l=>l.source_key.split('/').pop().startsWith(`${homeCodes[i]}-`));
 if(!source||!home)throw new Error(`Unresolved source/lesson for ${m[1]}`);
 const prompt=field('正面'), answer=field('最小答案');
 if(!prompt||!answer)throw new Error(`Empty card ${m[1]}`);
 const concept=block.match(/概念：`([^`]+)`/)?.[1]||m[1].toLowerCase();
 const id=stableId(`card:${m[1]}`);
 const kind=block.match(/类型：([^；\n]+)/)?.[1]||'概念';
 cards.push({id,canonical_key:m[1],lesson_id:home.id,chapter_id:home.chapter_id,concept_keys:[concept],position:i+1,active_revision:1,lifecycle:'active'});
 revisions.push({card_id:id,revision:1,title:m[2],kind,prompt,answer_short:answer,required_points:(field('必答点')||answer).split('；'),pitfalls:field('误区'),explanation:'',estimated_seconds:Number(block.match(/预计 (\d+) 秒/)?.[1]||45),source_refs:[{source_revision_id:source.id,lesson_id:source.lesson_id,title:lessons.find(l=>l.id===source.lesson_id).title,line_start:Number(link[2]),content_hash:source.content_hash}]});
}
if(chapters.length!==9||lessons.length!==70||cards.length!==14)throw new Error('Content inventory does not match SPEC-001');
mkdirSync('data/private',{recursive:true});
writeFileSync('data/private/seed.json',JSON.stringify({chapters,lessons,sources,cards,revisions}));
writeFileSync('docs/verification/content-inventory.md',`# 内容导入清单\n\n生成时间：${new Date().toISOString()}\n\n9章 / 70篇 / 14张试点卡；核心卡目标360。来源与样卡解析校验通过。\n\n| 章节 | 单元 | 卡片 |\n| --- | ---: | ---: |\n${chapters.map(c=>`| ${c.title} | ${lessons.filter(l=>l.chapter_id===c.id).length} | ${cards.filter(k=>k.chapter_id===c.id).length} |`).join('\n')}\n\n全量原文仅存储在被忽略的data/private和私有数据库表中。\n`);
console.log(JSON.stringify({chapters:chapters.length,lessons:lessons.length,sources:sources.length,cards:cards.length,sourceCharacters:sources.reduce((n,s)=>n+s.body_markdown.length,0)}));
