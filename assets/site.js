(() => {
  const root = document.documentElement;
  const localePaths = new Set(['de', 'es', 'fr', 'hu', 'pt-br', 'ru', 'zh-cn']);
  const languageNames = { en:'English', de:'Deutsch', es:'Español', fr:'Français', hu:'Magyar', 'pt-br':'Português (Brasil)', ru:'Русский', 'zh-cn':'简体中文' };
  const ui = {
    en:{language:'Language',dark:'Dark',light:'Light',reader:'Reader view',standard:'Standard view'},
    de:{language:'Sprache',dark:'Dunkel',light:'Hell',reader:'Lesefreundlich',standard:'Standardansicht'},
    es:{language:'Idioma',dark:'Oscuro',light:'Claro',reader:'Vista de lectura',standard:'Vista estándar'},
    fr:{language:'Langue',dark:'Sombre',light:'Clair',reader:'Mode lecture',standard:'Vue standard'},
    hu:{language:'Nyelv',dark:'Sötét',light:'Világos',reader:'Olvasóbarát',standard:'Normál nézet'},
    'pt-br':{language:'Idioma',dark:'Escuro',light:'Claro',reader:'Leitura fácil',standard:'Visual padrão'},
    ru:{language:'Язык',dark:'Тёмная',light:'Светлая',reader:'Для чтения',standard:'Обычный вид'},
    'zh-cn':{language:'语言',dark:'深色',light:'浅色',reader:'阅读模式',standard:'标准视图'}
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

  const tools = document.querySelector('.header-tools') || document.querySelector('.preview-strip .shell');
  if (tools && !document.querySelector('[data-reading-toggle]')) {
    const readerButton = document.createElement('button');
    readerButton.type = 'button';
    readerButton.className = 'reading-toggle';
    readerButton.dataset.readingToggle = '';
    readerButton.dataset.readerLabel = text.reader;
    readerButton.dataset.standardLabel = text.standard;
    readerButton.setAttribute('aria-pressed', 'false');
    readerButton.innerHTML = '<span class="reading-mark" aria-hidden="true">Aa</span><span data-reading-label></span>';
    tools.append(readerButton);
  }

  const themeButton = document.querySelector('[data-theme-toggle]');
  const readingButton = document.querySelector('[data-reading-toggle]');
  const picker = document.querySelector('[data-language-picker]');
  const themeMedia = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  const storageGet = (key) => {
    try { return localStorage.getItem(key); } catch (_) { return null; }
  };
  const storageSet = (key, value) => {
    try { localStorage.setItem(key, value); } catch (_) { /* preference remains valid for this page */ }
  };

  const preferredTheme = () => {
    const saved = storageGet('ril-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return themeMedia && themeMedia.matches ? 'dark' : 'light';
  };

  const syncThemeAssets = (theme) => {
    const dark = theme === 'dark';
    document.querySelectorAll('img.hero-logo').forEach((img) => {
      const next = dark ? '/assets/logo-dark.svg' : '/assets/logo.svg';
      if (img.getAttribute('src') !== next) img.setAttribute('src', next);
    });
    const icon = document.querySelector('link[rel~="icon"]');
    if (icon) icon.setAttribute('href', dark ? '/assets/mark-dark.svg' : '/assets/mark.svg');
    let themeColor = document.querySelector('meta[name="theme-color"]');
    if (!themeColor) {
      themeColor = document.createElement('meta');
      themeColor.name = 'theme-color';
      document.head.append(themeColor);
    }
    themeColor.content = dark ? '#101112' : '#f4f4f0';
  };

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    syncThemeAssets(theme);
    if (!themeButton) return;
    const dark = theme === 'dark';
    themeButton.setAttribute('aria-pressed', String(dark));
    const actionLabel = dark ? themeButton.dataset.lightLabel : themeButton.dataset.darkLabel;
    const labelNode = themeButton.querySelector('[data-theme-label]');
    if (labelNode) labelNode.textContent = actionLabel || (dark ? text.light : text.dark);
    themeButton.setAttribute('aria-label', actionLabel || (dark ? text.light : text.dark));
  };

  const applyReading = (mode) => {
    const friendly = mode === 'friendly';
    root.dataset.reading = friendly ? 'friendly' : 'standard';
    if (!readingButton) return;
    readingButton.setAttribute('aria-pressed', String(friendly));
    const actionLabel = friendly ? readingButton.dataset.standardLabel : readingButton.dataset.readerLabel;
    const labelNode = readingButton.querySelector('[data-reading-label]');
    if (labelNode) labelNode.textContent = actionLabel || (friendly ? text.standard : text.reader);
    readingButton.setAttribute('aria-label', actionLabel || (friendly ? text.standard : text.reader));
  };

  applyTheme(preferredTheme());
  applyReading(storageGet('ril-reading') === 'friendly' ? 'friendly' : 'standard');

  if (themeButton) themeButton.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    storageSet('ril-theme', next);
    applyTheme(next);
  });
  if (themeMedia && !storageGet('ril-theme')) {
    themeMedia.addEventListener('change', (event) => applyTheme(event.matches ? 'dark' : 'light'));
  }
  if (readingButton) readingButton.addEventListener('click', () => {
    const next = root.dataset.reading === 'friendly' ? 'standard' : 'friendly';
    storageSet('ril-reading', next);
    applyReading(next);
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
