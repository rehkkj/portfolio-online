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

      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 120) {
        p.x += dx / dist * 1.2;
        p.y += dy / dist * 1.2;
      }
    });

    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const MAX = 130;

        if (dist < MAX) {
          const alpha = (1 - dist / MAX) * 0.4;
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
          ctx.strokeStyle = `rgba(124, 58, 237, ${alpha})`;
          ctx.stroke();
        }
      }

      ctx.beginPath();
      ctx.arc(points[i].x, points[i].y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(191, 122, 254, 0.6)';
      ctx.fill();
    }

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

  targets.forEach((el, i) => {
    el.classList.add('reveal');
    if (el.classList.contains('skill-tile') || el.classList.contains('project-card') || el.classList.contains('stat')) {
      el.style.transitionDelay = `${i * 0.05}s`;
    }
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  });

  targets.forEach(el => observer.observe(el));
}

initScrollReveal();

/* =====================================================
   CONTADOR
   ===================================================== */
function animateCounters() {
  const counters = document.querySelectorAll('.stat-num');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = parseInt(e.target.dataset.target);
        let current = 0;

        const timer = setInterval(() => {
          current += Math.ceil(target / 40);
          e.target.textContent = current;
          if (current >= target) clearInterval(timer);
        }, 40);

        observer.unobserve(e.target);
      }
    });
  });

  counters.forEach(el => observer.observe(el));
}

animateCounters();

/* =====================================================
   CONTACT FORM — EMAILJS ✅
   ===================================================== */

// ⚠️ COLOQUE SUA PUBLIC KEY AQUI
(function() {
  emailjs.init("T1VROgbtqLJ08RiuQ");
})();

const form     = document.getElementById('contactForm');
const sysNotif = document.getElementById('sysNotification');

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const nome     = form.querySelector('#nome').value.trim();
  const email    = form.querySelector('#email').value.trim();
  const mensagem = form.querySelector('#mensagem').value.trim();

  if (!nome || !email || !mensagem) return;

  const btn = form.querySelector('button');
  btn.disabled = true;
  btn.textContent = "Enviando...";

  emailjs.send("service_a4uawpk", "template_kcnt2jm", {
    nome: nome,
    email: email,
    mensagem: mensagem,
    date: new Date().toLocaleString()
  })
  .then(() => {
    sysNotif.classList.add('show');
    setTimeout(() => sysNotif.classList.remove('show'), 4000);
    form.reset();

    btn.disabled = false;
    btn.textContent = "Enviar Mensagem";
  })
  .catch((erro) => {
    console.error("Erro:", erro);
    alert("Erro ao enviar mensagem");

    btn.disabled = false;
    btn.textContent = "Enviar Mensagem";
  });
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
