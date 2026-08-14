(() => {
  const root = document.documentElement;
  const localePaths = new Set(['de', 'es', 'fr', 'hu', 'pt-br', 'ru', 'zh-cn']);
  const languageNames = { en:'English', de:'Deutsch', es:'Español', fr:'Français', hu:'Magyar', 'pt-br':'Português (Brasil)', ru:'Русский', 'zh-cn':'简体中文' };
  const ui = {
    en:{language:'Language',dark:'Dark',light:'Light'}, de:{language:'Sprache',dark:'Dunkel',light:'Hell'}, es:{language:'Idioma',dark:'Oscuro',light:'Claro'}, fr:{language:'Langue',dark:'Sombre',light:'Clair'}, hu:{language:'Nyelv',dark:'Sötét',light:'Világos'}, 'pt-br':{language:'Idioma',dark:'Escuro',light:'Claro'}, ru:{language:'Язык',dark:'Тёмная',light:'Светлая'}, 'zh-cn':{language:'语言',dark:'深色',light:'浅色'}
  };

  const documentLocale = () => {
    const raw = (root.lang || 'en').toLowerCase();
    if (raw.startsWith('pt')) return 'pt-br';
    if (raw.startsWith('zh')) return 'zh-cn';
    const short = raw.split('-')[0];
    return localePaths.has(short) ? short : 'en';
  };

  const locale = documentLocale();
  const text = ui[locale] || ui.en;

  if (!document.querySelector('[data-language-picker]') || !document.querySelector('[data-theme-toggle]')) {
    const bar = document.createElement('div');
    bar.className = 'preview-strip';
    const shell = document.createElement('div');
    shell.className = 'shell';
    const tools = document.createElement('div');
    tools.className = 'header-tools';
    tools.setAttribute('aria-label', text.language);

    const label = document.createElement('label');
    label.className = 'language-picker';
    const hidden = document.createElement('span');
    hidden.className = 'visually-hidden';
    hidden.textContent = text.language;
    const select = document.createElement('select');
    select.dataset.languagePicker = '';
    select.setAttribute('aria-label', text.language);
    Object.entries(languageNames).forEach(([value,name]) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = name;
      if (value === locale) option.selected = true;
      select.append(option);
    });
    label.append(hidden, select);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-toggle';
    button.dataset.themeToggle = '';
    button.dataset.darkLabel = text.dark;
    button.dataset.lightLabel = text.light;
    button.setAttribute('aria-pressed', 'false');
    button.innerHTML = '<span class="theme-dot" aria-hidden="true"></span><span data-theme-label></span>';
    tools.append(label, button);
    shell.append(tools);
    bar.append(shell);
    document.body.prepend(bar);
  }

  let themeButton = document.querySelector('[data-theme-toggle]');
  let picker = document.querySelector('[data-language-picker]');

  const preferredTheme = () => {
    const saved = localStorage.getItem('ril-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    if (!themeButton) return;
    const dark = theme === 'dark';
    themeButton.setAttribute('aria-pressed', String(dark));
    const label = dark ? themeButton.dataset.lightLabel : themeButton.dataset.darkLabel;
    const node = themeButton.querySelector('[data-theme-label]');
    if (node) node.textContent = label || (dark ? text.light : text.dark);
  };

  applyTheme(preferredTheme());
  if (themeButton) themeButton.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('ril-theme', next);
    applyTheme(next);
  });

  const stripLocalePrefix = (pathname) => {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length && localePaths.has(parts[0].toLowerCase())) parts.shift();
    return '/' + (parts.length ? parts.join('/') + '/' : '');
  };
  const pathForLocale = (targetLocale, pathname) => {
    const base = stripLocalePrefix(pathname);
    return targetLocale === 'en' ? base : `/${targetLocale}${base}`;
  };

  if (picker) {
    if ([...picker.options].some(option => option.value === locale)) picker.value = locale;
    picker.addEventListener('change', () => {
      const targetLocale = picker.value;
      document.cookie = `site_lang=${encodeURIComponent(targetLocale)}; Max-Age=31536000; Path=/; SameSite=Lax; Secure`;
      window.location.assign(pathForLocale(targetLocale, window.location.pathname));
    });
  }
})();
