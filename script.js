'use strict';

document.querySelectorAll('article pre > code').forEach((code, index) => {
  const pre = code.parentElement;
  const block = document.createElement('div');
  block.className = 'code-block';
  const toolbar = document.createElement('div');
  toolbar.className = 'code-toolbar';
  const status = document.createElement('span');
  status.className = 'copy-status';
  status.id = `copy-status-${index}`;
  status.setAttribute('role', 'status');
  const button = document.createElement('button');
  button.className = 'copy-button';
  button.type = 'button';
  button.textContent = 'Copy to clipboard';
  button.setAttribute('aria-describedby', status.id);
  toolbar.append(status, button);
  pre.before(block);
  block.append(toolbar, pre);
  let resetTimer;
  button.addEventListener('click', async () => {
    clearTimeout(resetTimer);
    try {
      await navigator.clipboard.writeText(code.textContent);
      status.textContent = 'Copied!';
    } catch {
      status.textContent = 'Copy failed. Select the text and copy manually.';
    }
    resetTimer = setTimeout(() => { status.textContent = ''; }, 4000);
  });
});

const toc = document.querySelector('.page-toc');
const headings = [...document.querySelectorAll('article h1[id], article h2[id], article h3[id], article h4[id]')];
const links = [...toc.querySelectorAll('a[href^="#"]')];
let scheduled = false;
function updateCurrentHeading() {
  let current = headings[0];
  for (const heading of headings) {
    if (heading.getBoundingClientRect().top > 100) break;
    current = heading;
  }
  for (const link of links) {
    if (current && decodeURIComponent(link.hash.slice(1)) === current.id) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  }
  scheduled = false;
}
window.addEventListener('scroll', () => {
  if (!scheduled) {
    scheduled = true;
    requestAnimationFrame(updateCurrentHeading);
  }
}, { passive: true });
const compact = window.matchMedia('(max-width: 760px)');
const details = toc.querySelector('details');
function setTocLayout() { details.open = !compact.matches; }
compact.addEventListener('change', setTocLayout);
setTocLayout();
updateCurrentHeading();
