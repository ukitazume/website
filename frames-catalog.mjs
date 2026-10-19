import fs from 'node:fs';
import {createHash} from 'node:crypto';

const catalog=JSON.parse(fs.readFileSync(new URL('./data/frames-catalog.json',import.meta.url),'utf8'));
const total=catalog.groups.reduce((n,g)=>n+g.frames.length,0);
const assetVersion=extension=>createHash('sha256').update(fs.readFileSync(new URL(`./dist/assets/frames-catalog.${extension}`,import.meta.url))).digest('hex').slice(0,12);
export function framesCatalogAssets(){return `<link rel="stylesheet" href="/assets/frames-catalog.css?v=${assetVersion('css')}"><script src="/assets/frames-catalog.js?v=${assetVersion('js')}" defer></script>`;}
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const copy={
 ja:{title:'考えたいことから、フレームを選ぶ。',intro:`優先順位を決める、選択肢を比べる、経験を振り返る。${total}種類を11の用途に分けて紹介します。気になる用途を開くと、フレームのしくみ・使いどころ・具体例を読めます。`,jump:'収録フレームを見る',search:'名前や考えたいことで探す',placeholder:'例：SWOT、優先順位、目標',clear:'クリア',count:'表示件数',when:'使いどころ',example:'たとえば、こんな問いに',empty:'該当するフレームがありません。別の言葉で探してみてください。',note:'審査提出版に収録しているフレームです。説明・問い・記入例を手がかりに、白紙のノートからも始められます。'},
 en:{title:'Find a frame for what’s on your mind.',intro:`Set priorities, compare options, or reflect on an experience. Explore ${total} frameworks across 11 purposes. Open a group to see how each frame works, when to use it, and a question it can help with.`,jump:'Explore the frameworks',search:'Search by name or what you want to think through',placeholder:'Try SWOT, priorities, or goals',clear:'Clear',count:'Shown',when:'When to use it',example:'A question to try',empty:'No frameworks match. Try another name or keyword.',note:'Frameworks included in the submitted version. Each has an explanation, prompts, and a worked example. You can also start with a blank note.'},
 'zh-Hans':{title:'从想思考的问题，找到合适的框架。',intro:`确定优先级、比较方案、回顾经历。按11种用途探索${total}种框架，展开分类即可了解原理、使用场景与具体示例。`,jump:'查看收录的框架',search:'按名称或想思考的问题搜索',placeholder:'例如：SWOT、优先级、目标',clear:'清除',count:'显示数量',when:'何时使用',example:'可以从这个问题开始',empty:'没有匹配的框架，请尝试其他名称或关键词。',note:'这些框架已包含在提交审核的版本中。每种框架都有说明、引导问题与填写示例，也可以从空白笔记开始。'}
};

export function framesCatalogLink(locale){return `<nav class="framework-jumps" aria-label="${{ja:'Framesの紹介',en:'Explore Frames','zh-Hans':'了解Frames'}[locale]}"><a class="framework-jump" href="#frameworks">${copy[locale].jump} <span aria-hidden="true">↓</span></a><a class="framework-jump" href="#a4-example">${pdfCopy[locale].jump} <span aria-hidden="true">↓</span></a></nav>`;}

const pdfCopy={
 ja:{jump:'A4出力例を見る',title:'考えを、A4一枚で持ち出す。',intro:'ノートとまとめをPDFに書き出して、印刷や共有に。白紙のワークシートなら、画面を離れて手書きで考えられます。',name:'出力例：ジョハリの窓',description:'「自分が知っているか」「相手が知っているか」の2つの軸で、自分の見え方を整理するフレームです。このPDFは、問いと記入欄を残した白紙の出力例です。',features:[['テーマ','考えたいテーマや課題を書く欄。'],['4つの視点','開放・盲点・秘密・未知の各欄に、問いと手書き用の罫線。'],['まとめ','「大切な気づき」と「次の一歩」を、同じ一枚に。']],size:'A4縦 · 210 × 297 mm · 1ページ',open:'PDFを開く',download:'PDFをダウンロード',caption:'ジョハリの窓の白紙ワークシート。日本語の実際の出力例です。',alt:'Framesから出力したジョハリの窓のA4ワークシート。テーマ、4区画、気づきと次の一歩の記入欄。',note:'入力済みのノートもPDFにできます。内容が多い場合は、一枚に収まるよう文字が小さくなります。'},
 en:{jump:'See an A4 export',title:'Take your thinking onto one A4 page.',intro:'Export a note and its summary as a PDF to print or share. A blank worksheet lets you step away from the screen and think by hand.',name:'Export example: Johari window',description:'Explore how you see yourself through two questions: what do you know about yourself, and what do others know? This example is a blank worksheet with prompts and space to write.',features:[['Theme','A space for the topic or question you want to explore.'],['Four perspectives','Open, blind, hidden, and unknown areas, with prompts and ruled writing space.'],['Summary','Key insights and a next step on the same sheet.']],size:'A4 portrait · 210 × 297 mm · 1 page',open:'Open PDF',download:'Download PDF',caption:'A blank Johari window worksheet. This actual export is in Japanese.',alt:'An A4 Johari window worksheet exported from Frames, with a theme, four areas, key insights, and a next step.',note:'Filled notes can also be exported. Dense notes use smaller text to fit the page.'},
 'zh-Hans':{jump:'查看A4导出示例',title:'把思考，带到一张A4纸上。',intro:'将笔记与总结导出为PDF，便于打印或分享。也可以用空白练习表离开屏幕，手写整理想法。',name:'导出示例：乔哈里窗',description:'以“自己是否知道”和“他人是否知道”为两个维度，整理对自己的认识。这份PDF是保留引导问题与书写区域的空白练习表。',features:[['主题','写下想思考的主题或问题。'],['四个视角','开放区、盲区、隐藏区和未知区，均保留问题与手写横线。'],['总结','在同一页记录重要发现与下一步行动。']],size:'A4纵向 · 210 × 297 mm · 1页',open:'打开PDF',download:'下载PDF',caption:'乔哈里窗的空白练习表。这是日语版的实际导出示例。',alt:'Frames导出的A4乔哈里窗练习表，包含主题、四个区域、重要发现与下一步行动。',note:'已填写的笔记也可导出为PDF。内容较多时，字号会缩小以适应页面。'}
};

export function renderFramesPDF(locale){
 const t=pdfCopy[locale],pdf='/examples/frames-johari-a4.pdf';
 return `<section class="frames-pdf" id="a4-example" aria-labelledby="a4-example-title"><div class="frames-pdf-copy"><p class="eyebrow">FROM SCREEN TO PAPER</p><h2 id="a4-example-title">${t.title}</h2><p class="frames-pdf-intro">${t.intro}</p><h3>${t.name}</h3><p>${t.description}</p><dl>${t.features.map(([name,text],i)=>`<div><dt><span aria-hidden="true">0${i+1}</span>${name}</dt><dd>${text}</dd></div>`).join('')}</dl><p class="frames-pdf-size">${t.size}</p><div class="frames-pdf-actions"><a href="${pdf}" target="_blank" rel="noopener">${t.open} <span aria-hidden="true">↗</span></a><a href="${pdf}" download="frames-johari-a4.pdf">${t.download} <span aria-hidden="true">↓</span></a></div><p class="note">${t.note}</p></div><figure class="frames-pdf-preview"><a href="${pdf}" target="_blank" rel="noopener" aria-label="${t.open}"><img src="/assets/frames-johari-a4.png" alt="${t.alt}" width="1191" height="1684" loading="lazy"></a><figcaption>${t.caption}</figcaption></figure></section>`;
}

export function renderFramesCatalog(locale){
 const t=copy[locale];
 return `<section class="framework-catalog" id="frameworks" aria-labelledby="frameworks-title" data-framework-catalog>
  <div class="framework-heading"><div><p class="eyebrow">THE FRAMEWORKS</p><h2 id="frameworks-title">${t.title}</h2></div><span class="framework-total">${total}<small>FRAMES</small></span></div>
  <p class="framework-intro">${t.intro}</p>
  <div class="framework-search" data-framework-search hidden><label for="framework-query">${t.search}</label><div class="framework-search-row"><input id="framework-query" type="search" placeholder="${t.placeholder}" autocomplete="off" aria-controls="framework-groups"><button type="button" data-framework-clear hidden>${t.clear}</button></div><p class="framework-count" role="status" aria-live="polite">${t.count}: <span data-framework-count>${total} / ${total}</span></p></div>
  <div class="framework-groups" id="framework-groups">${catalog.groups.map((group,index)=>`<details class="framework-group" data-framework-group ${index===0?'open':''}>
   <summary><span class="framework-group-number" aria-hidden="true">${String(index+1).padStart(2,'0')}</span><span class="framework-group-copy"><span class="framework-group-title">${escape(group.name[locale])}</span><span class="framework-group-preview">${group.frames.slice(0,3).map(f=>escape(f.locales[locale].name)).join(' · ')}</span></span><span class="framework-group-count">${group.frames.length}</span><span class="framework-toggle" aria-hidden="true">+</span></summary>
   <div class="framework-entries">${group.frames.map(frame=>{const c=frame.locales[locale];const search=[group.name[locale],...Object.values(c),...Object.values(frame.locales).map(x=>x.name)].join(' ');return `<article class="framework-entry" id="framework-${frame.id}" data-framework-entry data-framework-keywords="${escape(search)}"><h3>${escape(c.name)}</h3><p class="framework-about">${escape(c.about)}</p><dl><div><dt>${t.when}</dt><dd>${escape(c.when)}</dd></div><div class="framework-example"><dt>${t.example}</dt><dd>${escape(c.example)}</dd></div></dl></article>`}).join('')}</div>
  </details>`).join('')}</div>
  <p class="framework-empty" data-framework-empty hidden>${t.empty}</p>
  <p class="note">${t.note}</p>
 </section>`;
}
