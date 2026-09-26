const filterButtons = [...document.querySelectorAll('[data-filter]')];
const search = document.querySelector('.dash-search input');
const rows = [...document.querySelectorAll('.dash-table tbody tr')];
let filter = 'all';
function filterCollaborations() {
  let count = 0;
  rows.forEach(row => {
    row.hidden = !((filter === 'all' || row.dataset.state === filter) && row.textContent.toLowerCase().includes(search.value.toLowerCase().trim()));
    if (!row.hidden) count++;
  });
  document.querySelector('.result-count').textContent = `${count} collaboration${count === 1 ? '' : 's'}`;
  document.querySelector('.dash-empty').hidden = count > 0;
}
filterButtons.forEach(button => button.addEventListener('click', () => {
  filter = button.dataset.filter;
  filterButtons.forEach(item => { item.classList.toggle('is-selected', item === button); item.setAttribute('aria-pressed', String(item === button)); });
  filterCollaborations();
}));
search.addEventListener('input', filterCollaborations);
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const wordmark = document.querySelector('.footer-wordmark');
const letters = [...wordmark.children];
let mm;
window.guapdMotionReady?.then(() => {
  mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.from(letters, {yPercent:110, rotation:6, opacity:0, stagger:.055, duration:1.2, ease:'power4.out', scrollTrigger:{trigger:wordmark,start:'top 96%',once:true}});
  });
});
function resetLetters() { if (!window.gsap || motion.matches || document.documentElement.dataset.motion === 'paused') return; gsap.to(letters, {y:0,rotation:0,color:'#252625',duration:1,ease:'elastic.out(1,.45)',overwrite:'auto'}); }
wordmark.addEventListener('pointermove', event => {
  if (!window.gsap || motion.matches || document.documentElement.dataset.motion === 'paused' || event.pointerType === 'touch') return;
  letters.forEach(letter => {
    const box = letter.getBoundingClientRect();
    const distance = (event.clientX - (box.left + box.width / 2)) / Math.max(1,box.width);
    const influence = Math.max(0,1-Math.abs(distance)/1.3);
    gsap.to(letter,{y:-Math.min(40,box.height*.12)*influence,rotation:distance*influence*6,color:influence>.7?'#718748':'#252625',duration:.55,ease:'power3.out',overwrite:'auto'});
  });
});
wordmark.addEventListener('pointerleave',resetLetters);

document.addEventListener('guapd-motion-change', event => {
  if (event.detail && window.gsap) {
    gsap.killTweensOf(letters);
    gsap.set(letters, {clearProps:'all'});
    mm?.revert();
  }
});
// Anchor navigation uses one scroll operation, never a hash jump followed by a tween.
document.querySelectorAll('.creator-rail a[href^="#"], .next-card a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const target = document.querySelector(link.hash);
    if (!target) return;
    event.preventDefault();
    const reduce = motion.matches || document.documentElement.dataset.motion === 'paused';
    target.setAttribute('tabindex', '-1');
    target.focus({preventScroll:true});
    target.scrollIntoView({behavior:reduce ? 'instant' : 'smooth',block:'start'});
    history.replaceState(null, '', link.hash);
  });
});
