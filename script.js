/* =====================================================
   PORTFÓLIO — RENNAN PENGA
   script.js — Interatividade e animações
   ===================================================== */

/* ---- Cursor customizado ---- */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

(function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + 'px';
  follower.style.top  = followerY + 'px';
  requestAnimationFrame(animateFollower);
})();

document.querySelectorAll('a, button, .skill-tile, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2)';
    cursor.style.background = 'transparent';
    cursor.style.border = '1.5px solid var(--accent)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    cursor.style.background = 'var(--accent)';
    cursor.style.border = 'none';
  });
});

/* ---- Navbar scroll ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ---- Hamburguer mobile ---- */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ---- Ano no footer ---- */
document.getElementById('year').textContent = new Date().getFullYear();

/* =====================================================
   CANVAS — MESH ANIMADO
   ===================================================== */
(function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = canvas.width  = canvas.offsetWidth;
  let H = canvas.height = canvas.offsetHeight;

  let mouse = { x: W / 2, y: H / 2 };

  canvas.closest('section').addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  const NUM_POINTS = 80;
  const points = [];

  for (let i = 0; i < NUM_POINTS; i++) {
    points.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    });
  }

  function drawMesh() {
    ctx.clearRect(0, 0, W, H);

    points.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    requestAnimationFrame(drawMesh);
  }

  drawMesh();

  window.addEventListener('resize', () => {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  });
})();

/* =====================================================
   SCROLL REVEAL
   ===================================================== */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.sobre-grid, .section-header, .skill-tile, .project-card, .contato-grid, .sobre-stats .stat'
  );

  targets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  });

  targets.forEach(el => observer.observe(el));
}

initScrollReveal();

/* =====================================================
   CONTATO — FORMSPREE ✅
   ===================================================== */

const form     = document.getElementById('contactForm');
const sysNotif = document.getElementById('sysNotification');

form.addEventListener('submit', async function(e) {
  e.preventDefault();

  const btn = form.querySelector('button');
  btn.disabled = true;
  btn.textContent = "Enviando...";

  const data = new FormData(form);

  try {
    await fetch(form.action, {
      method: "POST",
      body: data,
      headers: {
        'Accept': 'application/json'
      }
    });

    sysNotif.classList.add('show');
    setTimeout(() => sysNotif.classList.remove('show'), 4000);

    form.reset();

  } catch (error) {
    alert("Erro ao enviar mensagem");
  }

  btn.disabled = false;
  btn.textContent = "Enviar Mensagem";
});

/* =====================================================
   SMOOTH SCROLL
   ===================================================== */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});
``
