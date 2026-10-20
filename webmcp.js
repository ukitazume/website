(() => {
  const registry = document.modelContext;
  if (typeof registry?.registerTool !== 'function') return;
  const locale = document.documentElement.lang;
  const categories = ['all', 'productivity', 'thinking', 'learning', 'lifestyle', 'game'];
  let lifecycle;
  let catalogPromise;
  const catalog = () => catalogPromise ||= fetch('/assets/app-catalog.json').then(response => {
    if (!response.ok) throw new Error('App catalog is temporarily unavailable.');
    return response.json();
  }).then(data => data[locale] || data.en).catch(error => { catalogPromise = undefined; throw error; });
  function validate(input, fields) {
    if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).some(key => !fields.includes(key))) throw new Error('Invalid tool arguments.');
  }
  const schema = (properties, required = []) => ({type:'object', properties, required, additionalProperties:false});
  function register() {
    if (lifecycle && !lifecycle.signal.aborted) return;
    lifecycle = new AbortController();
    const tools = [{
      name:'search_apps',
      description:'Find MTK SH apps and read official descriptions, release status, app languages, and detail/support/privacy links in the current website language. Does not open the App Store or install apps.',
      inputSchema:schema({query:{type:'string', maxLength:200}, category:{type:'string', enum:categories}}),
      annotations:{readOnlyHint:true},
      async execute(input) {
        validate(input, ['query', 'category']);
        if (input.query !== undefined && (typeof input.query !== 'string' || input.query.length > 200)) throw new Error('query must be a string of at most 200 characters.');
        if (input.category !== undefined && !categories.includes(input.category)) throw new Error('Unknown category.');
        const query = (input.query || '').trim().toLocaleLowerCase();
        const apps = (await catalog()).filter(app => (!input.category || input.category === 'all' || app.category === input.category) && [app.name, app.slug, app.description, ...app.features].join(' ').toLocaleLowerCase().includes(query));
        return {locale, apps};
      },
    }];
    if (document.querySelector('[data-filter]')) tools.push({
      name:'filter_apps', description:'Change the visible app collection category using the same controls as the page.',
      inputSchema:schema({category:{type:'string', enum:categories}}, ['category']),
      execute(input) {
        validate(input, ['category']);
        if (!categories.includes(input.category)) throw new Error('Unknown category.');
        const button = [...document.querySelectorAll('[data-filter]')].find(item => item.dataset.filter === input.category);
        if (!button) throw new Error('Category control unavailable.');
        button.click();
        return {category:input.category, visibleApps:[...document.querySelectorAll('.app-card')].filter(card => !card.hidden).map(card => ({name:card.querySelector('h3').textContent, url:card.querySelector('.card-main').href}))};
      },
    });
    if (document.querySelector('[data-app-tabs]')) tools.push({
      name:'show_app_section', description:'Display details, support, or privacy for the current app using its visible tabs. Returns the displayed section text. Does not send email.',
      inputSchema:schema({section:{type:'string', enum:['details', 'support', 'privacy']}}, ['section']),
      execute(input) {
        validate(input, ['section']);
        if (!['details', 'support', 'privacy'].includes(input.section)) throw new Error('Unknown section.');
        const tab = [...document.querySelectorAll('[data-app-tab]')].find(item => item.dataset.appTab === input.section);
        if (!tab) throw new Error('Section control unavailable.');
        tab.click();
        const panel = document.getElementById(tab.getAttribute('aria-controls'));
        if (!panel || panel.hidden || tab.getAttribute('aria-selected') !== 'true') throw new Error('Section could not be displayed.');
        return {section:input.section, text:panel.innerText};
      },
    });
    for (const tool of tools) {
      try {
        Promise.resolve(registry.registerTool(tool, {signal:lifecycle.signal})).catch(error => console.warn('WebMCP registration failed:', tool.name, error));
      } catch (error) { console.warn('WebMCP registration failed:', tool.name, error); }
    }
  }
  register();
  window.addEventListener('pagehide', () => lifecycle?.abort());
  window.addEventListener('pageshow', register);
})();
