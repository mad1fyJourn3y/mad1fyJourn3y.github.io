document.documentElement.classList.add('js');

// =====================
// Typewriter effect
// =====================
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const els = document.querySelectorAll('.typed');

  if (reduceMotion) {
    els.forEach(el => { el.textContent = el.dataset.text || ''; });
    return;
  }

  let delay = 300;
  els.forEach((el) => {
    const text = el.dataset.text || '';
    el.textContent = '';
    setTimeout(() => typeText(el, text, 0), delay);
    delay += text.length * 55 + 450;
  });

  function typeText(el, text, i) {
    if (i > text.length) return;
    el.textContent = text.slice(0, i);
    setTimeout(() => typeText(el, text, i + 1), 45 + Math.random() * 40);
  }
})();

// =====================
// Reveal on scroll
// =====================
(function () {
  const targets = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    targets.forEach(t => t.classList.add('in'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(t => io.observe(t));
})();


// =====================
// Animated background (flow lines)
// =====================
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  let w, h;
  let particles = [];
  const count = 90;

  let mouse = { x: 0, y: 0, radius: 120 };

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  function Particle() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.vx = (Math.random() - 0.5) * 0.6;
    this.vy = (Math.random() - 0.5) * 0.6;
    this.size = 1.2;
  }

  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > w) this.vx *= -1;
    if (this.y < 0 || this.y > h) this.vy *= -1;
  };

  Particle.prototype.draw = function () {
    ctx.fillStyle = "rgba(0,255,156,0.5)";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  };

  function connect() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = "rgba(0,255,156,0.08)";
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }

      // mouse interaction lines
      let dxm = particles[i].x - mouse.x;
      let dym = particles[i].y - mouse.y;
      let mdist = Math.sqrt(dxm * dxm + dym * dym);

      if (mdist < mouse.radius) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(0,255,156,0.25)";
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
  }

  function init() {
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);

    for (let p of particles) {
      p.update();
      p.draw();
    }

    connect();

    requestAnimationFrame(animate);
  }

  init();
  animate();
})();