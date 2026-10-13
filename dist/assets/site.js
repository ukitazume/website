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
