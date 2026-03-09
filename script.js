/* ============================================================
   script.js — Portfolio interactions
   ============================================================ */

/* ---------- 3D geometric background canvas ---------- */
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');
let W = 0, H = 0;

function resize() {
  const prevW = W, prevH = H;
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
  /* Rescale existing shape positions proportionally when the window resizes */
  if (prevW && prevH) {
    const scaleX = W / prevW, scaleY = H / prevH;
    for (const s of shapes) { s.x *= scaleX; s.y *= scaleY; }
  }
}

/* 3D shape vertex / edge data */
const TETRA_VERTS = [[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]];
const TETRA_EDGES = [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
const OCTA_VERTS  = [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
const OCTA_EDGES  = [[0,2],[0,3],[0,4],[0,5],[1,2],[1,3],[1,4],[1,5],[2,4],[2,5],[3,4],[3,5]];

function rotateVert(v, rx, ry, rz) {
  let [x, y, z] = v;
  let cy = Math.cos(ry), sy = Math.sin(ry);
  [x, z] = [x * cy - z * sy, x * sy + z * cy];
  let cx = Math.cos(rx), sx = Math.sin(rx);
  [y, z] = [y * cx - z * sx, y * sx + z * cx];
  let cz = Math.cos(rz), sz = Math.sin(rz);
  [x, y] = [x * cz - y * sz, x * sz + y * cz];
  return [x, y, z];
}

function project(v, fov) {
  const p = fov / (fov + v[2]);
  return [v[0] * p, v[1] * p];
}

/* Alpha mask: strong at left/right edges, fades to transparent at center;
   top and bottom edges are capped at 50% opacity. */
function shapeAlpha(cx, cy) {
  const nx = cx / W;
  const ny = cy / H;
  const hAlpha = Math.pow(Math.abs(nx * 2 - 1), 1.4);
  const vAlpha = 0.5 + 0.5 * (1 - Math.pow(Math.abs(ny * 2 - 1), 2));
  return hAlpha * vAlpha;
}

/* Build shape pool — initialized after first resize() so W/H are valid */
const PALETTE = ['59,130,246', '168,85,247', '110,160,255'];
const SHAPE_COUNT = 24;
const shapes = [];

function initShapes() {
  shapes.length = 0;
  for (let i = 0; i < SHAPE_COUNT; i++) {
    shapes.push({
      x:        Math.random() * W,
      y:        Math.random() * H,
      vx:       (Math.random() - 0.5) * 0.18,
      vy:       (Math.random() - 0.5) * 0.18,
      scale:    22 + Math.random() * 55,
      rx:       Math.random() * Math.PI * 2,
      ry:       Math.random() * Math.PI * 2,
      rz:       Math.random() * Math.PI * 2,
      drx:      (Math.random() - 0.5) * 0.005,
      dry:      (Math.random() - 0.5) * 0.006,
      drz:      (Math.random() - 0.5) * 0.004,
      type:     i % 3 === 0 ? 'octa' : 'tetra',
      color:    PALETTE[i % PALETTE.length],
      maxAlpha: 0.35 + Math.random() * 0.45,
    });
  }
}

/* Initialize canvas size first, then shapes */
resize();
initShapes();
window.addEventListener('resize', resize, { passive: true });

function drawShape(s) {
  const verts = s.type === 'tetra' ? TETRA_VERTS : OCTA_VERTS;
  const edges = s.type === 'tetra' ? TETRA_EDGES : OCTA_EDGES;

  const projected = verts.map((v) => {
    const r = rotateVert(v, s.rx, s.ry, s.rz);
    const p = project(r, 320);
    return [s.x + p[0] * s.scale, s.y + p[1] * s.scale];
  });

  const alpha = shapeAlpha(s.x, s.y) * s.maxAlpha;
  if (alpha < 0.012) return;

  ctx.strokeStyle = `rgba(${s.color},${alpha})`;
  ctx.lineWidth   = 0.9;
  ctx.beginPath();
  for (const [a, b] of edges) {
    ctx.moveTo(projected[a][0], projected[a][1]);
    ctx.lineTo(projected[b][0], projected[b][1]);
  }
  ctx.stroke();
}

function animateCanvas() {
  ctx.clearRect(0, 0, W, H);
  for (const s of shapes) {
    drawShape(s);
    s.x  += s.vx;  s.y  += s.vy;
    s.rx += s.drx; s.ry += s.dry; s.rz += s.drz;
    if (s.x < -120) s.x = W + 120;
    if (s.x > W + 120) s.x = -120;
    if (s.y < -120) s.y = H + 120;
    if (s.y > H + 120) s.y = -120;
  }
  requestAnimationFrame(animateCanvas);
}
animateCanvas();

/* ---------- Typed tagline ---------- */
const phrases = [
  'Building things for the web.',
  'Clean code. Smooth design.',
  'Developer & creator.',
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typed-text');

function type() {
  const current = phrases[phraseIndex];

  if (isDeleting) {
    typedEl.textContent = current.slice(0, --charIndex);
  } else {
    typedEl.textContent = current.slice(0, ++charIndex);
  }

  let typingDelay = isDeleting ? 45 : 80;

  if (!isDeleting && charIndex === current.length) {
    typingDelay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    typingDelay = 400;
  }

  setTimeout(type, typingDelay);
}

type();

/* ---------- Render project cards from projects.js ---------- */

/* Escape HTML special characters to prevent XSS */
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* Only allow http/https URLs and plain relative paths */
function safeHref(href) {
  const s = String(href);
  if (/^https?:\/\//i.test(s) || /^[a-zA-Z0-9._/~-]/.test(s)) return s;
  return '#';
}

/* Script loads at end of <body> so DOM is ready when this runs */
function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid || typeof PROJECTS === 'undefined') return;

  grid.innerHTML = PROJECTS.map((p, i) => {
    const ghostClass = p.ghost ? ' card--ghost' : '';
    const linksHtml = (p.links && p.links.length)
      ? `<div class="card-links">
          ${p.links.map(l => {
            const href  = safeHref(l.href);
            const ext   = /^https?:\/\//i.test(href) ? ' target="_blank" rel="noopener"' : '';
            const dim   = l.dim ? ' card-link--dim' : '';
            return `<a href="${esc(href)}"${ext} class="card-link${dim}">${esc(l.label)} &rarr;</a>`;
          }).join('\n          ')}
        </div>`
      : '';

    return `<article class="card${ghostClass}" data-index="${i}">
        <div class="card-accent"></div>
        <div class="card-body">
          <span class="card-tag">${esc(p.tag)}</span>
          <h3 class="card-title">${esc(p.title)}</h3>
          <p class="card-desc">${esc(p.desc)}</p>
          ${linksHtml}
        </div>
      </article>`;
  }).join('\n');
}

renderProjects();

/* ---------- Scroll-reveal cards & sections ---------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const revealDelay = el.dataset.index ? Number(el.dataset.index) * 100 : 0;
        setTimeout(() => el.classList.add('visible'), revealDelay);
        revealObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.card, .fade-up').forEach((el) => {
  revealObserver.observe(el);
});

/* ---------- Footer year ---------- */
document.getElementById('year').textContent = new Date().getFullYear();

