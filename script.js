/* ============================================
   SEVEN Statistics - JavaScript
   SPA Router, Animations, Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initRouter();
  initNavbar();
  initScrollReveal();
  initHeroCanvas();
});

/* ---------- SPA Hash Router ---------- */
function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

function handleRoute() {
  const hash = window.location.hash.slice(1) || 'beranda';
  const pages = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('.navbar-menu a[data-page]');

  pages.forEach(page => {
    page.classList.toggle('active', page.id === `page-${hash}`);
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('data-page') === hash);
  });

  // Scroll to top on page change
  window.scrollTo({ top: 0, behavior: 'instant' });

  // Re-initialize animations for new page
  setTimeout(() => {
    initScrollReveal();
    initChartAnimations();
    initFAQ();
    initContactForm();
    initCounters();
  }, 100);
}

function navigateTo(page) {
  window.location.hash = page;
}

/* ---------- Navbar ---------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.navbar-menu');
  const navOverlay = document.querySelector('.nav-overlay');

  // Scroll effect
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Mobile menu toggle
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
      navOverlay.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('open');
      navOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // Close menu on link click
  document.querySelectorAll('.navbar-menu a').forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('open');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
}

/* ---------- Scroll Reveal Animation ---------- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => {
    observer.observe(el);
  });
}

/* ---------- Counter Animation ---------- */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const suffix = el.getAttribute('data-suffix') || '';
  const prefix = el.getAttribute('data-prefix') || '';
  const duration = 2000;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    
    el.textContent = prefix + current.toLocaleString() + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = prefix + target.toLocaleString() + suffix;
    }
  }

  requestAnimationFrame(update);
}

/* ---------- Chart Animations ---------- */
function initChartAnimations() {
  const charts = document.querySelectorAll('.bar-chart-svg, .donut-chart-svg, .line-chart-svg, .scatter-svg');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
    });
  }, { threshold: 0.3 });

  charts.forEach(chart => observer.observe(chart));
}

/* ---------- FAQ Accordion ---------- */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;
    
    // Remove old listeners by cloning
    const newQuestion = question.cloneNode(true);
    question.parentNode.replaceChild(newQuestion, question);
    
    newQuestion.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all
      faqItems.forEach(i => i.classList.remove('active'));
      
      // Toggle current
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ---------- Contact Form → WhatsApp ---------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  // Remove old listeners by cloning
  const newForm = form.cloneNode(true);
  form.parentNode.replaceChild(newForm, form);

  newForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nama = newForm.querySelector('#contact-name')?.value || '';
    const email = newForm.querySelector('#contact-email')?.value || '';
    const whatsapp = newForm.querySelector('#contact-wa')?.value || '';
    const layanan = newForm.querySelector('#contact-service')?.value || '';
    const pesan = newForm.querySelector('#contact-message')?.value || '';

    const message = `Halo SEVEN Statistics,%0A%0A` +
      `Saya ingin konsultasi mengenai:%0A` +
      `*Nama:* ${nama}%0A` +
      `*Email:* ${email}%0A` +
      `*Layanan:* ${layanan}%0A` +
      `*Pesan:* ${pesan}`;

    const waUrl = `https://api.whatsapp.com/send/?phone=6289531852251&text=${message}`;
    window.open(waUrl, '_blank');
  });
}

/* ---------- Hero Canvas - Network Visualization ---------- */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let animationFrame;
  const particleCount = 80;
  const connectionDistance = 150;
  const mouseRadius = 200;
  let mouse = { x: -9999, y: -9999 };

  function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, width, height);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const opacity = (1 - dist / connectionDistance) * 0.15;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(8, 145, 178, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw and update particles
    particles.forEach(p => {
      // Mouse interaction
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouseRadius) {
        const force = (mouseRadius - dist) / mouseRadius;
        p.vx -= (dx / dist) * force * 0.02;
        p.vy -= (dy / dist) * force * 0.02;
      }

      p.x += p.vx;
      p.y += p.vy;

      // Bounce off edges
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Keep in bounds
      p.x = Math.max(0, Math.min(width, p.x));
      p.y = Math.max(0, Math.min(height, p.y));

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(8, 145, 178, ${p.opacity})`;
      ctx.fill();

      // Glow effect for some particles
      if (p.radius > 2) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(8, 145, 178, ${p.opacity * 0.1})`;
        ctx.fill();
      }
    });

    // Draw some floating geometric shapes
    drawFloatingShapes();

    animationFrame = requestAnimationFrame(drawParticles);
  }

  // Floating geometric decorations
  let shapeTime = 0;
  function drawFloatingShapes() {
    shapeTime += 0.003;

    // Triangle
    const tx = width * 0.75 + Math.sin(shapeTime * 1.2) * 40;
    const ty = height * 0.3 + Math.cos(shapeTime * 0.8) * 30;
    ctx.save();
    ctx.translate(tx, ty);
    ctx.rotate(shapeTime);
    ctx.beginPath();
    ctx.moveTo(0, -15);
    ctx.lineTo(13, 10);
    ctx.lineTo(-13, 10);
    ctx.closePath();
    ctx.strokeStyle = 'rgba(8, 145, 178, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // Square
    const sx = width * 0.85 + Math.cos(shapeTime * 0.9) * 30;
    const sy = height * 0.6 + Math.sin(shapeTime * 1.1) * 25;
    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(-shapeTime * 0.7);
    ctx.strokeStyle = 'rgba(99, 102, 160, 0.1)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-10, -10, 20, 20);
    ctx.restore();

    // Circle
    const cx = width * 0.65 + Math.sin(shapeTime * 0.7) * 50;
    const cy = height * 0.7 + Math.cos(shapeTime * 1.3) * 35;
    ctx.beginPath();
    ctx.arc(cx, cy, 12, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(158, 142, 126, 0.1)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Mini bar chart
    drawMiniBarChart(width * 0.8, height * 0.15);
    
    // Mini line chart
    drawMiniLineChart(width * 0.55, height * 0.5);
  }

  function drawMiniBarChart(x, y) {
    const heights = [20, 35, 25, 40, 30];
    const barWidth = 6;
    const gap = 4;
    
    ctx.save();
    ctx.translate(x, y);
    
    heights.forEach((h, i) => {
      const animH = h * (0.5 + 0.5 * Math.sin(shapeTime * 2 + i));
      ctx.fillStyle = `rgba(8, 145, 178, ${0.08 + i * 0.02})`;
      ctx.fillRect(i * (barWidth + gap), -animH, barWidth, animH);
    });
    
    ctx.restore();
  }

  function drawMiniLineChart(x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    
    const points = [0, -15, -20, -10, -30, -18, -35, -25, -15];
    for (let i = 0; i < points.length; i++) {
      const px = i * 12;
      const py = points[i] + Math.sin(shapeTime * 2 + i * 0.5) * 5;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    
    ctx.strokeStyle = 'rgba(8, 145, 178, 0.1)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }

  // Event listeners
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  resize();
  createParticles();
  drawParticles();
}

/* ---------- WhatsApp Direct Link ---------- */
function openWhatsApp(layanan) {
  const message = layanan 
    ? `Halo SEVEN Statistics, saya ingin konsultasi mengenai layanan ${layanan}.`
    : `Halo SEVEN Statistics, saya ingin konsultasi gratis.`;
  const waUrl = `https://api.whatsapp.com/send/?phone=6289531852251&text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank');
}

/* ---------- Smooth Scroll to Contact with Pre-selected Service ---------- */
function goToContact(service) {
  window.location.hash = 'kontak';
  setTimeout(() => {
    const select = document.getElementById('contact-service');
    if (select && service) {
      select.value = service;
    }
  }, 200);
}
