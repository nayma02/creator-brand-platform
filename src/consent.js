// Cookie consent: prior consent, equal-weight choices, granular control, easy withdrawal.
// Nothing optional runs until its category is granted. Optional scripts are written as
//   <script type="text/plain" data-consent="analytics" data-src="https://…"></script>
// and are activated here once the visitor opts in.
(() => {
const CONFIG = {
  version: 1,                 // Bump when categories or purposes change: visitors are asked again.
  cookie: 'guapd_consent',    // Strictly necessary: stores this choice only.
  maxAgeDays: 180,            // Ask again after six months.
  categories: [
    { id: 'necessary', required: true, title: 'Strictly necessary', description: 'Keep the site secure and working, and remember your cookie choice.' },
    { id: 'analytics', title: 'Analytics', description: 'Help us understand, in aggregate, how people use the site so we can improve it.', cookies: [/^_ga/, /^_gid$/] },
    { id: 'marketing', title: 'Marketing', description: 'Measure campaigns and show relevant guapd ads on other sites.', cookies: [/^_fbp$/, /^_gcl_/] },
  ],
};
const optional = CONFIG.categories.filter(c => !c.required);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

function read() {
  const raw = document.cookie.split('; ').find(c => c.startsWith(CONFIG.cookie + '='));
  if (!raw) return null;
  try {
    const value = JSON.parse(decodeURIComponent(raw.slice(CONFIG.cookie.length + 1)));
    const expired = Date.now() - value.t > CONFIG.maxAgeDays * 864e5;
    return value.v === CONFIG.version && !expired ? value : null;
  } catch { return null; }
}
function write(choices, source) {
  const value = { v: CONFIG.version, t: Date.now(), c: choices, s: source };
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${CONFIG.cookie}=${encodeURIComponent(JSON.stringify(value))}; Max-Age=${CONFIG.maxAgeDays * 86400}; Path=/; SameSite=Lax${secure}`;
  return value;
}
function deleteCookies(patterns = []) {
  const names = document.cookie.split('; ').map(c => c.split('=')[0]).filter(Boolean);
  const host = location.hostname.split('.');
  const domains = ['', ...host.map((_, i) => '.' + host.slice(i).join('.'))];
  for (const name of names) if (patterns.some(p => p.test(name))) {
    for (const d of domains) document.cookie = `${name}=; Max-Age=0; Path=/${d ? '; Domain=' + d : ''}`;
  }
}

let state = read();
const granted = id => CONFIG.categories.find(c => c.id === id)?.required || Boolean(state?.c?.[id]);
const activated = new Set();

// Turn inert placeholders into running scripts for granted categories.
function activateScripts() {
  document.querySelectorAll('script[type="text/plain"][data-consent]').forEach(placeholder => {
    if (!granted(placeholder.dataset.consent) || activated.has(placeholder)) return;
    const script = document.createElement('script');
    for (const { name, value } of placeholder.attributes) if (!['type', 'data-consent', 'data-src'].includes(name)) script.setAttribute(name, value);
    if (placeholder.dataset.src) script.src = placeholder.dataset.src; else script.textContent = placeholder.textContent;
    activated.add(placeholder);
    placeholder.after(script);
  });
}

function apply(choices, source) {
  const before = state?.c || {};
  state = write(choices, source);
  // Withdrawal: remove that category's cookies. Scripts already running can only be stopped by a reload.
  let needsReload = false;
  for (const cat of optional) if (before[cat.id] && !choices[cat.id]) {
    deleteCookies(cat.cookies);
    if ([...activated].some(p => p.dataset.consent === cat.id)) needsReload = true;
  }
  activateScripts();
  document.dispatchEvent(new CustomEvent('guapd:consent', { detail: { ...choices } }));
  hideBanner();
  if (needsReload) location.reload();
}
const all = value => Object.fromEntries(optional.map(c => [c.id, value]));

// ---------- Banner ----------
const banner = document.createElement('section');
banner.className = 'consent-banner';
banner.setAttribute('aria-label', 'Cookie consent');
banner.hidden = true;
banner.innerHTML = `
  <p>We use optional analytics and marketing cookies only with your permission.</p>
  <div class="consent-actions">
    <button type="button" class="consent-manage" data-consent-open>Manage</button>
    <button type="button" class="consent-choice" data-consent-action="reject">Reject all</button>
    <button type="button" class="consent-choice" data-consent-action="accept">Accept all</button>
  </div>`;

function showBanner() {
  banner.hidden = false;
  if (!reducedMotion.matches) banner.animate([{ opacity: 0, translate: '0 12px' }, { opacity: 1, translate: '0 0' }], { duration: 280, easing: 'cubic-bezier(.22,1,.36,1)' });
}
function hideBanner() {
  if (banner.hidden) return;
  const hadFocus = banner.contains(document.activeElement);
  banner.hidden = true;
  if (hadFocus) document.getElementById('main')?.focus({ preventScroll: true });
}

// ---------- Preferences dialog ----------
const dialog = document.createElement('dialog');
dialog.className = 'consent-dialog';
dialog.setAttribute('aria-labelledby', 'consent-dialog-title');
dialog.innerHTML = `
  <button type="button" class="consent-close" aria-label="Close cookie preferences">×</button>
  <h2 id="consent-dialog-title">Cookie preferences</h2>
  <p class="consent-intro">Choose which cookies guapd may use. Optional cookies stay off unless you turn them on.</p>
  <p class="consent-gpc" hidden>Your browser is sending a Global Privacy Control signal, so optional cookies are off by default.</p>
  <div class="consent-list">${CONFIG.categories.map(c => `
    <div class="consent-row">
      <div><h3 id="consent-${c.id}-label">${c.title}</h3><p id="consent-${c.id}-desc">${c.description}</p></div>
      ${c.required
        ? '<span class="consent-always">Always on</span>'
        : `<label class="consent-switch"><input type="checkbox" role="switch" name="${c.id}" aria-labelledby="consent-${c.id}-label" aria-describedby="consent-${c.id}-desc"><span aria-hidden="true"></span></label>`}
    </div>`).join('')}
  </div>
  <p class="consent-meta"></p>
  <div class="consent-dialog-actions">
    <button type="button" class="button secondary" data-consent-action="reject">Reject all</button>
    <button type="button" class="button secondary" data-consent-action="accept">Accept all</button>
    <button type="button" class="button" data-consent-action="save">Save choices</button>
  </div>`;

function openPreferences() {
  for (const cat of optional) dialog.querySelector(`input[name="${cat.id}"]`).checked = granted(cat.id);
  dialog.querySelector('.consent-gpc').hidden = !navigator.globalPrivacyControl;
  dialog.querySelector('.consent-meta').textContent = state
    ? `Choice saved ${new Date(state.t).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}. We'll ask again after six months.`
    : 'Your choice is saved in one strictly necessary cookie for six months.';
  dialog.showModal();
}

document.addEventListener('click', event => {
  const action = event.target.closest('[data-consent-action]')?.dataset.consentAction;
  if (action === 'accept') { apply(all(true), 'accept-all'); if (dialog.open) dialog.close(); }
  else if (action === 'reject') { apply(all(false), 'reject-all'); if (dialog.open) dialog.close(); }
  else if (action === 'save') {
    apply(Object.fromEntries(optional.map(c => [c.id, dialog.querySelector(`input[name="${c.id}"]`).checked])), 'custom');
    dialog.close();
  }
  else if (event.target.closest('[data-consent-open]')) openPreferences();
  else if (event.target.closest('.consent-close')) dialog.close();
});
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const r = dialog.getBoundingClientRect();
  if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
});

// ---------- Start ----------
function start() {
  // Keyboard and screen-reader users meet the banner early; it still sits at the bottom visually.
  const skip = document.querySelector('.skip-link');
  (skip ? skip.after(banner) : document.body.prepend(banner));
  document.body.append(dialog);
  if (!state && navigator.globalPrivacyControl) state = write(all(false), 'gpc');
  activateScripts();
  if (!state) showBanner();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();

window.guapdConsent = { granted, open: openPreferences, config: CONFIG };
})();
