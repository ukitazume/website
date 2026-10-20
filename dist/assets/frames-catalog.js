document.querySelectorAll('[data-framework-catalog]').forEach(catalog => {
  const toolbar=catalog.querySelector('[data-framework-search]');
  const input=toolbar.querySelector('input');
  const clear=toolbar.querySelector('[data-framework-clear]');
  const groups=[...catalog.querySelectorAll('[data-framework-group]')];
  const entries=[...catalog.querySelectorAll('[data-framework-entry]')];
  const normalize=text=>text.normalize('NFKC').toLocaleLowerCase();
  const keywords=new Map(entries.map(entry=>[entry,normalize(entry.dataset.frameworkKeywords)]));
  let savedOpen=null;
  const update=()=>{
    const words=normalize(input.value).trim().split(/\s+/).filter(Boolean);
    if(words.length && !savedOpen)savedOpen=groups.map(group=>group.open);
    let count=0;
    entries.forEach(entry=>{entry.hidden=!words.every(word=>keywords.get(entry).includes(word));if(!entry.hidden)count++;});
    groups.forEach((group,index)=>{
      const groupEntries=[...group.querySelectorAll('[data-framework-entry]')];
      const matches=groupEntries.filter(entry=>!entry.hidden).length;
      const matching=matches>0;
      group.querySelector('.framework-group-count').textContent=words.length?`${matches} / ${groupEntries.length}`:groupEntries.length;
      group.hidden=!matching;
      if(words.length)group.open=matching;
      else if(savedOpen)group.open=savedOpen[index];
    });
    if(!words.length)savedOpen=null;
    clear.hidden=!input.value;
    catalog.querySelector('[data-framework-count]').textContent=`${count} / ${entries.length}`;
    catalog.querySelector('[data-framework-empty]').hidden=count!==0;
  };
  toolbar.hidden=false;
  input.addEventListener('input',update);
  clear.addEventListener('click',()=>{input.value='';update();input.focus();});
});
