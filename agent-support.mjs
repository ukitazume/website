import fs from 'node:fs';
import path from 'node:path';

// All agent-facing content comes from the same records as the visible pages.
export function buildAgentSupport({out, origin, locales, apps, supportData, href, store, isReleased}) {
  const catalog = Object.fromEntries(locales.map(locale => [locale, apps.map(app => ({
    slug: app.slug, name: app.name, category: app.type,
    description: app[locale].desc, features: app[locale].features,
    releaseStatus: isReleased(app) ? 'released' : app.releaseStatus,
    operatingSystem: `iOS ${app.os}+`, appLanguages: app[locale].lang,
    languageNote: app[locale].languageNote,
    url: origin + href(locale, app), supportUrl: origin + href(locale, app, 'support'),
    privacyUrl: origin + href(locale, app, 'privacy'),
    ...(isReleased(app) ? {appStoreUrl: store(app, locale)} : {}),
  }))]));
  fs.writeFileSync(path.join(out, 'assets/app-catalog.json'), JSON.stringify(catalog, null, 2) + '\n');
  fs.copyFileSync('webmcp.js', path.join(out, 'assets/webmcp.js'));
  const oneLine = value => String(value).replace(/\s+/g, ' ').trim();
  const overview = locale => `# MTK SH\n\n> Independent iOS apps by MTK SH. Official app descriptions, support guides, and privacy policies.\n\nWebsite languages: Japanese (ja), English (en), Simplified Chinese (zh-Hans). Website translations do not imply the app supports those languages. Release availability is stated per app; do not assume an app under review is downloadable. Contact: support@mtk.sh.\n\n## Apps\n\n${catalog[locale].map(app => `- [${app.name}](${app.url}): ${oneLine(app.description)} Status: ${app.releaseStatus}.`).join('\n')}\n\n## Support and privacy\n\n${catalog[locale].map(app => `- [${app.name} support](${app.supportUrl}): Usage guides and troubleshooting.\n- [${app.name} privacy](${app.privacyUrl}): Data handling and contact information.`).join('\n')}\n\n## Machine-readable resources\n\n- [App catalog](${origin}/assets/app-catalog.json): Localized descriptions, release status, languages, and official links.\n- [Expanded app information](${origin}/${locale}/llms-full.txt): Features, FAQs, support, and privacy content.\n\n## Other languages\n\n${locales.map(l => `- [${l}](${origin}/${l}/llms.txt): App index in ${l}.`).join('\n')}\n`;
  const plain = html => html.replace(/<br\s*\/?\s*>/gi, '\n').replace(/<\/(?:p|h[1-6]|li|ul|ol)>/gi, '\n').replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\n{3,}/g, '\n\n').trim();
  const expanded = locale => overview(locale) + '\n## App information\n\n' + apps.map(app => {
    const content = app[locale], support = supportData[app.slug][locale];
    return `### ${app.name}\n\n${content.desc}\n\n${content.body}\n\nStatus: ${isReleased(app) ? 'released' : app.releaseStatus}\nPlatform: iOS ${app.os}+\nApp languages: ${content.lang}\n${content.languageNote}\n\nFeatures:\n${content.features.map(feature => `- ${feature}`).join('\n')}\n\nFAQ:\n${content.faq.map(([q,a]) => `${q}\n${a}`).join('\n\n')}\n\nSupport: ${origin + href(locale, app, 'support')}\n${plain(support.support)}\n\nPrivacy: ${origin + href(locale, app, 'privacy')}\n${plain(support.privacy)}\n`;
  }).join('\n');
  for (const locale of locales) {
    fs.mkdirSync(path.join(out, locale), {recursive:true});
    fs.writeFileSync(path.join(out, locale, 'llms.txt'), overview(locale));
    fs.writeFileSync(path.join(out, locale, 'llms-full.txt'), expanded(locale));
  }
  fs.writeFileSync(path.join(out, 'llms.txt'), overview('en'));
  fs.writeFileSync(path.join(out, 'llms-full.txt'), expanded('en'));
}
