(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector('[data-theme-toggle]');
  const picker = document.querySelector('[data-language-picker]');
  const localePaths = new Set(['de', 'es', 'fr', 'hu', 'pt-br', 'ru', 'zh-cn']);

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
    const text = themeButton.querySelector('[data-theme-label]');
    if (text && label) text.textContent = label;
  };

  applyTheme(preferredTheme());

  if (themeButton) {
    themeButton.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('ril-theme', next);
      applyTheme(next);
    });
  }

  const stripLocalePrefix = (pathname) => {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length && localePaths.has(parts[0].toLowerCase())) {
      parts.shift();
    }
    return '/' + (parts.length ? parts.join('/') + '/' : '');
  };

  const pathForLocale = (locale, pathname) => {
    const base = stripLocalePrefix(pathname);
    if (locale === 'en') return base;
    return `/${locale}${base}`;
  };

  if (picker) {
    picker.addEventListener('change', () => {
      const locale = picker.value;
      document.cookie = `site_lang=${encodeURIComponent(locale)}; Max-Age=31536000; Path=/; SameSite=Lax; Secure`;
      window.location.assign(pathForLocale(locale, window.location.pathname));
    });
  }
})();
