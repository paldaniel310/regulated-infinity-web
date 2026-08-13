const supported = new Set(['en','de','es','fr','hu','pt-br','ru','zh-cn']);
const byCountry = {
  HU:'hu', DE:'de', AT:'de', LI:'de', FR:'fr', MC:'fr',
  ES:'es', MX:'es', AR:'es', CL:'es', CO:'es', PE:'es', VE:'es', EC:'es', BO:'es', PY:'es', UY:'es', CR:'es', PA:'es', GT:'es', HN:'es', SV:'es', NI:'es', DO:'es', CU:'es', PR:'es',
  BR:'pt-br', PT:'pt-br', RU:'ru', BY:'ru', CN:'zh-cn'
};

function savedLanguage(request) {
  const value = (request.headers.get('Cookie') || '').match(/(?:^|;\s*)site_lang=([^;]+)/)?.[1];
  if (!value) return null;
  const locale = decodeURIComponent(value).toLowerCase();
  return supported.has(locale) ? locale : null;
}

function preferredFromHeader(request, choices) {
  const header = (request.headers.get('Accept-Language') || '').toLowerCase();
  for (const locale of choices) {
    const token = locale === 'zh-cn' ? 'zh' : locale;
    if (header.includes(token)) return locale;
  }
  return null;
}

function countryLanguage(request) {
  const country = request.cf?.country;
  const region = request.cf?.regionCode;
  if (!country) return 'en';
  if (country === 'CA') return region === 'QC' ? 'fr' : (preferredFromHeader(request,['fr']) || 'en');
  if (country === 'CH') return preferredFromHeader(request,['de','fr']) || 'en';
  if (country === 'BE' || country === 'LU') return preferredFromHeader(request,['fr','de']) || 'en';
  if (country === 'SG') return preferredFromHeader(request,['zh-cn']) || 'en';
  return byCountry[country] || 'en';
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!['GET','HEAD'].includes(request.method.toUpperCase())) return env.ASSETS.fetch(request);
    const locale = savedLanguage(request) || countryLanguage(request);
    if (locale === 'en') return env.ASSETS.fetch(request);
    const target = new URL(`/${locale}${url.pathname}`.replace(/\/+/g,'/'), url.origin);
    target.search = url.search;
    return Response.redirect(target.toString(), 302);
  }
};
