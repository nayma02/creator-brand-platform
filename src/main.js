const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
function motionsOff() { return reducedMotion.matches; }
const hero = document.querySelector('.hero');
const rotating = document.querySelector('.rotating-word');
const labels = [...rotating.children];
let activeLabel = 0;
let heroVisible = true;
let timer;
function setLabel(index) {
  activeLabel = index;
  labels.forEach((label, i) => { label.dataset.active = String(i === index); });
  const range = document.createRange();
  range.selectNodeContents(labels[index]);
  rotating.style.width = `${range.getBoundingClientRect().width}px`;
}
function startRotation() {
  clearInterval(timer);
  if (!motionsOff() && !document.hidden && heroVisible) timer = setInterval(() => setLabel((activeLabel + 1) % labels.length), 3000);
}
new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; startRotation(); }).observe(hero);
document.addEventListener('visibilitychange', startRotation);
document.fonts.ready.then(() => setLabel(activeLabel));

const problem = document.querySelector('.problem');
const viewport = document.querySelector('.problem-viewport');
const heading = document.querySelector('.statement');
const reveal = document.querySelector('.word-reveal');
const text = reveal.textContent.trim();
reveal.replaceChildren(...text.split(/\s+/).flatMap((word, index) => {
  const span = document.createElement('span'); span.textContent = word;
  return index ? [document.createTextNode(' '), span] : [span];
}));
const words = [...reveal.children];
const clamp = value => Math.max(0, Math.min(1, value));
let progress = 0, networkProgress = 0, lastTime = 0, frame = 0;
let renderer, networkLoading = false, problemVisible = false;
const pointer = { x: 0, y: 0, active: false };
const smoothPointer = { x: 0, y: 0, active: false };
const canvas = document.querySelector('.network');

function updateProgress() {
  const rect = problem.getBoundingClientRect();
  progress = motionsOff() ? 1 : clamp(-rect.top / Math.max(1, problem.offsetHeight - viewport.offsetHeight));
  requestFrame();
}
function resize() {
  setLabel(activeLabel);
  if (renderer) {
    const box = viewport.getBoundingClientRect(), title = heading.getBoundingClientRect();
    renderer.resize(box.width, box.height, title.width, title.height, title.left + title.width / 2 - box.left, title.top + title.height / 2 - box.top);
  }
  updateProgress();
}
// Below-the-fold motion libraries load on the visitor's first interaction, keeping the first paint light.
let interacted = false;
let motionLib;
let motionReadyResolve;
window.guapdMotionReady = new Promise(resolve => { motionReadyResolve = resolve; });
function loadScript(src) { return new Promise((resolve, reject) => { const s = document.createElement('script'); s.src = src; s.onload = resolve; s.onerror = reject; document.head.append(s); }); }
function loadMotion() {
  motionLib ||= loadScript('/vendor/gsap.min.js').then(() => loadScript('/vendor/ScrollTrigger.min.js')).then(() => {
    gsap.registerPlugin(ScrollTrigger);
    setupReveal();
    document.documentElement.classList.remove('motion-pending');
    document.fonts.ready.then(() => ScrollTrigger.refresh());
    motionReadyResolve();
  }, () => document.documentElement.classList.remove('motion-pending'));
  return motionLib;
}
// Until GSAP arrives, the statement shows the reveal's starting frame (styled in CSS).
if (!motionsOff()) document.documentElement.classList.add('motion-pending');
// Exact reference timeline, with all words animated as requested.
let revealTimeline;
function setupReveal() {
  if (!window.gsap) return;
  revealTimeline?.scrollTrigger?.kill();
  revealTimeline?.kill();
  if (motionsOff()) {
    gsap.set(words, { filter: 'blur(0px)', opacity: 1, color: '#0d0d0d' });
    return;
  }
  revealTimeline = gsap.timeline({ scrollTrigger: {
    trigger: problem, start: 'top top',
    end: () => `+=${Math.max(1, (problem.offsetHeight - viewport.offsetHeight) * .85)}`, scrub: 1
  }}).fromTo(words, { color: '#505050', filter: 'blur(8px)', opacity: .8 }, {
    color: '#0d0d0d', duration: 1.2, ease: 'power3.out', filter: 'blur(0px)', opacity: 1, stagger: .5
  });
}
reducedMotion.addEventListener('change', setupReveal);
function tick(time) {
  frame = 0;
  const dt = lastTime ? Math.min(.05, (time - lastTime) / 1000) : 1 / 60;
  lastTime = time;
  if (renderer && problemVisible) {
    networkProgress = Math.min(progress, networkProgress + (progress - networkProgress) * (1 - Math.exp(-7 * dt)));
    const ease = 1 - Math.exp(-40 * dt);
    smoothPointer.x += (pointer.x - smoothPointer.x) * ease;
    smoothPointer.y += (pointer.y - smoothPointer.y) * ease;
    smoothPointer.active = pointer.active;
    renderer.render(dt, motionsOff() ? 1 : networkProgress, smoothPointer, motionsOff(), motionsOff() ? 0 : 1);
    canvas.dataset.ready = 'true';
  }
  if (!document.hidden && (problemVisible && renderer && !motionsOff())) requestFrame();
}
function requestFrame() { if (!frame && !document.hidden) frame = requestAnimationFrame(tick); }
async function loadNetwork() {
  if (renderer || networkLoading) return;
  networkLoading = true;
  try {
    const { NetworkRenderer } = await import('./network.js');
    renderer = new NetworkRenderer(canvas, { dot: [80,80,80], line: [143,143,143] });
    await renderer.load(); resize(); requestFrame();
  } catch (error) { console.warn('Network visual unavailable; page content remains readable.', error); renderer?.dispose(); renderer = undefined; }
}
new IntersectionObserver(([entry]) => { problemVisible = entry.isIntersecting; if (problemVisible) { if (interacted) loadNetwork(); updateProgress(); } else renderer?.pause(); }, { threshold: 0 }).observe(problem);
problem.addEventListener('pointermove', event => {
  if (event.pointerType !== 'mouse' || motionsOff()) return;
  const rect = viewport.getBoundingClientRect();
  pointer.x = (event.clientX - rect.left) / rect.width * 2 - 1;
  pointer.y = 1 - (event.clientY - rect.top) / rect.height * 2;
  pointer.active = true;
}, { passive: true });
problem.addEventListener('pointerleave', () => { pointer.active = false; });
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', resize, { passive: true });
document.addEventListener('visibilitychange', () => { if (!document.hidden) { lastTime = 0; updateProgress(); } });
reducedMotion.addEventListener('change', () => { setLabel(0); startRotation(); resize(); });
document.fonts.ready.then(resize);
updateProgress();

const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.mobile-menu');
const backdrop = document.querySelector('.menu-backdrop');
function setMenu(open) {
  menu.toggleAttribute('data-open', open); backdrop.toggleAttribute('data-open', open); menu.inert = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  if (open) menu.querySelector('button,a')?.focus({preventScroll:true});
}
function closeMenu() { const inside = menu.contains(document.activeElement); setMenu(false); if (inside) menuButton.focus({preventScroll:true}); }
menuButton.addEventListener('click', () => setMenu(!menu.hasAttribute('data-open')));
menu.addEventListener('click', event => { const item = event.target.closest('a,button'); if (item && item.getAttribute('aria-disabled') !== 'true') closeMenu(); });
backdrop.addEventListener('click', closeMenu);
matchMedia('(min-width: 768px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

// Destinations were not provided in Paper. Keep interactions explicit and local
// until real signup, login, and booking URLs are supplied.
const dialogs = {
  creators: ['For Creators', 'Agree on offers, share deliverables, and manage your brand collaborations in one shared space.'],
  brands: ['For Brands', 'Keep offers, approvals, deliverables, and creator payments together from start to finish.'],
  access: ['Get Access', 'Access is not open yet. Check back soon to start collaborating with guapd.'],
  demo: ['Request a demo', 'Demo booking is coming soon. You’ll be able to explore how guapd brings brands and creators together.'],
  login: ['Log in', 'The guapd workspace is coming soon. Account sign-in is not available yet.']
};
const dialog = document.querySelector('dialog');
let dialogOpener;
// A dialog opened from the mobile menu outlives its trigger (the menu closes), so return focus to the menu button.
dialog.addEventListener('close', () => {
  const target = dialogOpener?.isConnected && !dialogOpener.closest('[inert]') && dialogOpener.getClientRects().length ? dialogOpener : menu.contains(dialogOpener) ? menuButton : null;
  target?.focus({ preventScroll: true });
});
document.querySelectorAll('[data-dialog]').forEach(button => button.addEventListener('click', () => {
  dialogOpener = button;
  const [title, copy] = dialogs[button.dataset.dialog];
  document.querySelector('#dialog-title').textContent = title;
  document.querySelector('#dialog-copy').textContent = copy;
  dialog.showModal();
}));
document.querySelectorAll('.dialog-close,.dialog-done').forEach(button => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } });

// Scroll-linked sidebar for the four product workflow chapters.
const workflowSteps = [...document.querySelectorAll('.workflow-step')];
const workflowLinks = [...document.querySelectorAll('.workflow-sidebar a')];
let currentWorkflowStep;
const workflowSection = document.querySelector('.workflow');
function updateWorkflowLocation() {
  // Skip the per-step measurement while the section is far away (keeps its layout deferred).
  const box = workflowSection.getBoundingClientRect();
  if (box.top > innerHeight * 2 || box.bottom < -innerHeight) return;
  const marker = window.innerHeight * .35;
  let active = workflowSteps[0];
  for (const step of workflowSteps) if (step.getBoundingClientRect().top <= marker) active = step;
  const changed = currentWorkflowStep !== active;
  currentWorkflowStep = active;
  workflowLinks.forEach(link => {
    const selected = link.hash === `#${active?.id}`;
    if (selected) {
      link.setAttribute('aria-current', 'location');
      if (changed && matchMedia('(max-width: 767px)').matches) {
        const nav = link.parentElement;
        nav.scrollTo({ left: link.offsetLeft - 20, behavior: motionsOff() ? 'instant' : 'smooth' });
      }
    }
    else link.removeAttribute('aria-current');
  });
}
let workflowFrame = 0;
window.addEventListener('scroll', () => {
  if (workflowFrame) return;
  workflowFrame = requestAnimationFrame(() => { workflowFrame = 0; updateWorkflowLocation(); });
}, { passive: true });
workflowLinks.forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  const target = document.querySelector(link.hash);
  target?.scrollIntoView({ behavior: motionsOff() ? 'instant' : 'smooth', block: 'start' });
  history.replaceState(null, '', link.hash);
}));
updateWorkflowLocation();
window.addEventListener('resize', () => { currentWorkflowStep = null; updateWorkflowLocation(); }, { passive: true });

// Follow the operating system's reduced-motion preference.
function updateMotionPreference() {
  document.documentElement.dataset.motion = motionsOff() ? 'paused' : 'running';
  setLabel(0); startRotation(); setupReveal(); resize();
  document.dispatchEvent(new CustomEvent('guapd-motion-change', {detail:motionsOff()}));
}
reducedMotion.addEventListener('change', updateMotionPreference);
updateMotionPreference();
// Keep focus within the mobile overlay; Escape returns to the menu control.
document.addEventListener('keydown', event => {
  if (event.key !== 'Tab' || !menu.hasAttribute('data-open') || dialog.open) return;
  const stops = [menuButton, ...menu.querySelectorAll('button,a')];
  const current = stops.indexOf(document.activeElement);
  event.preventDefault();
  const next = (current + (event.shiftKey ? -1 : 1) + stops.length) % stops.length;
  stops[next].focus();
});

// First scroll, touch, click or key press starts the below-the-fold motion.
const firstInteraction = ['scroll', 'wheel', 'touchstart', 'pointerdown', 'keydown'];
function onFirstInteraction() {
  if (interacted) return;
  interacted = true;
  firstInteraction.forEach(type => removeEventListener(type, onFirstInteraction));
  loadMotion();
  loadNetwork();
}
firstInteraction.forEach(type => addEventListener(type, onFirstInteraction, { passive: true }));
if (scrollY > 0) onFirstInteraction();
