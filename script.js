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

// Follower com lag suave
(function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + 'px';
  follower.style.top  = followerY + 'px';
  requestAnimationFrame(animateFollower);
})();

// Cursor cresce em links e botões
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

// Fecha ao clicar em link
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});


/* ---- Ano no footer ---- */
document.getElementById('year').textContent = new Date().getFullYear();


/* =====================================================
   CANVAS — MESH ANIMADO (hero background)
   Partículas conectadas por linhas — efeito tecido digital
   ===================================================== */
(function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = canvas.width  = canvas.offsetWidth;
  let H = canvas.height = canvas.offsetHeight;

  let mouse = { x: W / 2, y: H / 2 };

  // Atualiza posição do mouse relativa ao canvas
  canvas.closest('section').addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  // Pontos da mesh
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

    // Atualiza posição dos pontos
    points.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      // Rejeita nas bordas
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      // Repulsão leve do mouse
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 120) {
        p.x += dx / dist * 1.2;
        p.y += dy / dist * 1.2;
      }
    });

    // Linhas de conexão
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx   = points[i].x - points[j].x;
        const dy   = points[i].y - points[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const MAX  = 130;

        if (dist < MAX) {
          const alpha = (1 - dist / MAX) * 0.4;
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
          ctx.strokeStyle = `rgba(124, 58, 237, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Ponto
      ctx.beginPath();
      ctx.arc(points[i].x, points[i].y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(191, 122, 254, 0.6)';
      ctx.fill();
    }

    requestAnimationFrame(drawMesh);
  }

  drawMesh();

  // Redimensiona o canvas
  window.addEventListener('resize', () => {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  });
})();


/* =====================================================
   SCROLL REVEAL — elementos entram na viewport
   ===================================================== */
function initScrollReveal() {
  // Adiciona classe reveal a elementos alvo
  const targets = document.querySelectorAll(
    '.sobre-grid, .section-header, .skill-tile, .project-card, .contato-grid, .sobre-stats .stat'
  );

  targets.forEach((el, i) => {
    el.classList.add('reveal');
    // Delay em cascata para grades
    if (el.classList.contains('skill-tile') || el.classList.contains('project-card') || el.classList.contains('stat')) {
      el.style.transitionDelay = `${i * 0.05}s`;
    }
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  targets.forEach(el => observer.observe(el));
}

initScrollReveal();


/* =====================================================
   CONTADOR ANIMADO — Sobre (Stats)
   ===================================================== */
function animateCounters() {
  const counters = document.querySelectorAll('.stat-num');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = parseInt(e.target.dataset.target);
        let current = 0;
        const step = Math.ceil(target / 40);

        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          e.target.textContent = current;
          if (current >= target) clearInterval(timer);
        }, 40);

        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

animateCounters();


/* =====================================================
   SKILL TILES — Tooltip de competências
   ===================================================== */
const tooltip = document.getElementById('skillTooltip');

document.querySelectorAll('.skill-tile').forEach(tile => {
  const competencies = tile.dataset.competencies;
  const name = tile.querySelector('.skill-name').textContent;

  tile.addEventListener('mouseenter', () => {
    tooltip.innerHTML = `<strong>${name}</strong>${competencies}`;
    tooltip.classList.add('visible');
  });

  tile.addEventListener('mousemove', e => {
    tooltip.style.left = (e.clientX + 20) + 'px';
    tooltip.style.top  = (e.clientY - 10) + 'px';
  });

  tile.addEventListener('mouseleave', () => {
    tooltip.classList.remove('visible');
  });
});


/* =====================================================
   PROJECT CARDS — Lens colorida que segue o mouse
   Ao hover, a imagem aparece colorida dentro de um círculo
   ===================================================== */
document.querySelectorAll('.project-card').forEach(card => {

  // Cria o elemento "info" do projeto a partir dos data-attributes
  const title  = card.dataset.title;
  const desc   = card.dataset.desc;
  const tags   = card.dataset.tags.split(',').map(t => t.trim());
  const demo   = card.dataset.demo;
  const source = card.dataset.source;
  const bgImg  = card.style.backgroundImage; // ex: url('...')

  // Injeta as informações no card
  const infoHTML = `
    <div class="project-info">
      <h3>${title}</h3>
      <p>${desc}</p>
      <div class="project-tags">
        ${tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
      </div>
      <div class="project-btns">
        <a href="${demo}" target="_blank" class="project-btn demo">Live Demo ↗</a>
        <a href="${source}" target="_blank" class="project-btn src">Código →</a>
      </div>
    </div>
  `;
  card.insertAdjacentHTML('beforeend', infoHTML);

  // Cria a lente circular
  const lens = document.createElement('div');
  lens.className = 'project-lens';
  lens.style.opacity = '0';
  card.appendChild(lens);

  // A lente mostra a imagem original colorida dentro do círculo
  // Técnica: background-image igual ao card, mas sem grayscale
  const rawUrl = bgImg.slice(4, -1).replace(/['"]/g, '');
  lens.style.backgroundImage = bgImg;
  lens.style.backgroundSize  = 'cover';
  lens.style.backgroundPosition = 'center';

  let lensVisible = false;

  card.addEventListener('mouseenter', () => {
    lensVisible = true;
    lens.style.opacity = '1';
  });

  card.addEventListener('mouseleave', () => {
    lensVisible = false;
    lens.style.opacity = '0';
  });

  card.addEventListener('mousemove', e => {
    if (!lensVisible) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    lens.style.left = x + 'px';
    lens.style.top  = y + 'px';

    // Ajusta posição do background da lens para espelhar o card
    const pctX = (x / rect.width)  * 100;
    const pctY = (y / rect.height) * 100;
    lens.style.backgroundPosition = `${pctX}% ${pctY}%`;
  });
});


const form     = document.getElementById('contactForm');
const sysNotif = document.getElementById('sysNotification');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome     = form.querySelector('#nome').value.trim();
  const email    = form.querySelector('#email').value.trim();
  const mensagem = form.querySelector('#mensagem').value.trim();

  if (!nome || !email || !mensagem) return;

  // Enviando para o Google Script
  try {
    await fetch("https://script.google.com/macros/s/AKfycbwmtvZKHvYOnXMEIpkF-ncD3ALeq87g1T1AFaucpKsn/dev", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    nome,
    email,
    mensagem
  }),
  mode: "no-cors"
});

    // Sucesso
    sysNotif.classList.add('show');
    setTimeout(() => sysNotif.classList.remove('show'), 4000);

    form.reset();

  } catch (erro) {
    console.error("Erro ao enviar:", erro);
    alert("Erro ao enviar mensagem.");
  }
});


/* =====================================================
   TIPOGRAFIA CINÉTICA — letter-spacing sutil no scroll
   ===================================================== */
(function initKineticType() {
  const outlined = document.getElementById('nameOutlined');
  const solid    = document.getElementById('nameSolid');
  if (!outlined || !solid) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    const velocity = Math.abs(current - lastScroll);
    const stretch = Math.min(velocity * 0.005, 0.05); // cap em 0.05em

    outlined.style.letterSpacing = `-${0.05 - stretch}em`;
    solid.style.letterSpacing    = `-${0.05 - stretch}em`;

    lastScroll = current;
  });
})();


/* =====================================================
   SMOOTH SCROLL — para links âncora
   ===================================================== */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});
