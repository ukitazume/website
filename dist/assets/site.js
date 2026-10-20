const buttons = [...document.querySelectorAll('[data-filter]')];
buttons.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  let count=0;
  document.querySelectorAll('.app-card').forEach(card => {
    card.hidden = filter !== 'all' && card.dataset.category !== filter;
    if(!card.hidden)count++;
  });
  const status=document.querySelector('.filter-status');
  if(status) status.textContent=`${button.textContent.trim()}: ${count}`;
}));
document.addEventListener('click', event => document.querySelectorAll('.language[open]').forEach(menu => {if(!menu.contains(event.target))menu.open=false;}));
document.addEventListener('keydown', event => {if(event.key==='Escape')document.querySelectorAll('.language[open]').forEach(menu=>{menu.open=false;menu.querySelector('summary').focus()})});
document.querySelectorAll('[data-app-tabs]').forEach(tablist => {
  const main = tablist.closest('.detail-main');
  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  const activate = (tab, moveFocus = false) => {
    const selected = tab.dataset.appTab;
    tabs.forEach(item => {
      const active = item === tab;
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
    });
    main.querySelectorAll('[data-app-panel]').forEach(panel => { panel.hidden = panel.dataset.appPanel !== selected; });
    main.querySelectorAll('[data-app-hero]').forEach(hero => { hero.hidden = hero.dataset.appHero !== selected; });
    if (moveFocus) tab.focus();
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', event => {
      const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length
        : event.key === 'ArrowLeft' ? (index + tabs.length - 1) % tabs.length
        : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : -1;
      if (next < 0) return;
      event.preventDefault();
      activate(tabs[next], true);
    });
  });
  main.querySelectorAll('[data-app-tab-target]').forEach(button => button.addEventListener('click', () => {
    const tab = tabs.find(item => item.dataset.appTab === button.dataset.appTabTarget);
    if (tab) activate(tab);
  }));
});
