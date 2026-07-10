/* ============================================
   AMORE — Premium Love Website JavaScript
   ============================================ */

/* ========== LOADER ========== */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    initRevealAnimations();
    startFloatingHearts();
  }, 1800);
});


/* ========== CUSTOM CURSOR ========== */
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');

let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateTrail() {
  trailX += (mouseX - trailX) * 0.12;
  trailY += (mouseY - trailY) * 0.12;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top = trailY + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

document.querySelectorAll('a, button, input, .occ-btn').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(2)';
    cursor.style.background = 'rgba(255, 107, 157, 0.4)';
    cursorTrail.style.borderColor = 'rgba(255, 107, 157, 0.6)';
    cursorTrail.style.transform = 'translate(-50%, -50%) scale(1.5)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    cursor.style.background = '#ff6b9d';
    cursorTrail.style.borderColor = 'rgba(255, 107, 157, 0.4)';
    cursorTrail.style.transform = 'translate(-50%, -50%) scale(1)';
  });
});

/* ========== NAV SCROLL ========== */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

/* ========== PARTICLE CANVAS ========== */
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
let W, H;

function resizeCanvas() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.4 + 0.05;
    this.hue = Math.random() > 0.5 ? '#ff6b9d' : '#a29bfe';
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) {
      this.reset();
    }
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.hue;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

for (let i = 0; i < 80; i++) {
  particles.push(new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ========== FLOATING HEARTS ========== */
function startFloatingHearts() {
  const container = document.getElementById('floatHearts');
  const heartPaths = ['♥', '❤', '♡'];

  function spawnHeart() {
    const heart = document.createElement('span');
    heart.className = 'float-heart-el';
    heart.textContent = heartPaths[Math.floor(Math.random() * heartPaths.length)];
    const size = Math.random() * 18 + 10;
    const left = Math.random() * 100;
    const duration = Math.random() * 8 + 6;
    const delay = Math.random() * 2;
    heart.style.cssText = `
      left: ${left}%;
      bottom: -50px;
      font-size: ${size}px;
      color: rgba(255, 107, 157, ${Math.random() * 0.4 + 0.1});
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;
    container.appendChild(heart);
    setTimeout(() => heart.remove(), (duration + delay) * 1000);
  }

  setInterval(spawnHeart, 1200);
}

/* ========== SCROLL REVEAL ========== */
function initRevealAnimations() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => observer.observe(el));

  // Hero elements – trigger immediately
  document.querySelectorAll('.hero .reveal-up').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 200 + i * 120);
  });
}

/* ========== COUNTER ANIMATION ========== */
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = current.toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(el => animateCounter(el));
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.about-stats');
if (statsEl) statObserver.observe(statsEl);

/* ========== OCCASION SELECTION ========== */
let selectedOccasion = 'Anniversary';

document.querySelectorAll('.occ-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.occ-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedOccasion = btn.dataset.occ;
  });
});

/* ========== MESSAGE GENERATION ========== */
const messages = {
  'Anniversary': [
    `Every year I spend with you adds a new colour to my world that I never knew existed before. {name1}, you are the reason I believe in the kind of love that doesn't fade — it deepens. Happy Anniversary. The best is still ahead, because we write it together.`,
    `They say time changes everything. But loving you, {name1}, has only made me more certain — more sure of your laughter, your warmth, your hands in mine. {name2} is lucky to know a love that only grows more beautiful. Happy Anniversary, my forever.`,
    `Some love stories are written in ink. Ours is written in the quiet mornings, the long conversations, the silly jokes only we understand. {name1}, you are my favourite story — one I want to keep reading for the rest of my life. Happy Anniversary.`,
  ],
  'Birthday': [
    `{name1}, on the day you were born, the world quietly became a better place — though it would take a while for everyone else to notice what I already know. Happy Birthday. May this year bring you everything your beautiful soul deserves, and may I be there to celebrate every moment of it.`,
    `Another year of you — what a gift. {name1}, your birthday feels like a personal holiday to me, because you are worth celebrating every single day. From {name2}, with all the love in the world: Happy Birthday.`,
    `Every candle on your cake is a year the universe spent making you more extraordinary. {name1}, you are one of a kind, and I am endlessly grateful that our paths crossed. Happy Birthday — now let's make this year unforgettable.`,
  ],
  "Valentine's Day": [
    `{name1}, before I met you, I thought Valentine's Day was just a date on the calendar. Now I know it's a reminder — one I don't actually need — that you are the best thing in my life. Happy Valentine's Day, from {name2}, who loves you more than words can hold.`,
    `If love were a language, you would be every word I've ever needed. {name1}, you are the poem I kept trying to write and never could — until I found you. Happy Valentine's Day. You are my greatest inspiration.`,
    `They say love is grand, and I finally understand why. {name1}, loving you is the grandest thing I've ever done. Today, and every day, I choose you — completely and without hesitation. Happy Valentine's Day.`,
  ],
  'Proposal': [
    `{name1}, I have searched for words beautiful enough for this moment, and I've come to accept that none exist. So I'll simply say: you are the home I never knew I was looking for. Will you let me spend the rest of my life being yours? — {name2}`,
    `Every road I've ever taken has led me to you. {name1}, I don't want a single path that doesn't have you beside me. I love you more than I know how to say — so I'm asking with my whole heart instead: will you marry me?`,
    `{name1}, I knew from the moment I truly saw you that my life had quietly divided into before and after. I want to spend every after with you. You are my answer to everything. Will you be mine — forever?`,
  ],
  'Good Morning': [
    `Good morning, {name1}. Before the world gets loud, before the day demands anything — know that someone is already thinking of you and smiling. {name2} hopes your morning is as warm and beautiful as you are.`,
    `The sun rose today, {name1}, but honestly — you outshine it. Good morning from {name2}. May your coffee be strong, your day be kind, and your heart be as light as it makes mine feel.`,
    `{name1}, a new day means a new chance to be happy. I hope you woke up feeling loved — because you are, completely and without question. Good morning. {name2} is rooting for you today and always.`,
  ],
  'Good Night': [
    `As the night wraps around you, {name1}, I hope you feel how loved you are. Every star out tonight is just the universe agreeing with me: you are extraordinary. Sleep well. {name2} will be here when you wake.`,
    `Good night, {name1}. May your dreams be as gentle and beautiful as your heart. Thank you for being the best part of my every day — I couldn't imagine this life without you in it. Rest well.`,
    `The day is done, {name1}, and somewhere in it, {name2} thought of you more times than they'd care to admit. Good night. Dream something wonderful. Tomorrow I get to love you all over again.`,
  ],
  'Missing You': [
    `{name1}, there's a specific kind of quiet that settles in when you're not around — not peaceful, just empty. I miss you in small ways and enormous ones. {name2} is counting the moments until we're together again.`,
    `Distance has a way of reminding you just how much someone matters. {name1}, I didn't need the reminder — but here I am, missing you with my whole chest. Come back soon. The world is less colourful without you.`,
    `Missing you, {name1}, feels like standing in a room where music just stopped. Everything is fine, technically — and yet, not quite right. {name2} can't wait to hear the music again.`,
  ],
  'Just Because': [
    `{name1}, no special reason today — just this: I love you. I love the way you exist in the world, the way you make everything feel softer. {name2} just wanted you to know, on an ordinary day, that you are extraordinary.`,
    `Today has no occasion, no milestone — just a quiet moment where {name2} thought: does {name1} know how loved they are? So. Do you? Because you are. Deeply, sincerely, completely loved.`,
    `{name1}, sometimes love doesn't need a reason or a season. It just shows up on a regular Tuesday and says — hey, you matter to me. You always have. You always will. That's all. That's everything.`,
  ],
};

/* ========== AI MESSAGE GENERATOR ========== */
function generateMockAIMessage(name1, name2, occasion) {
  const intros = [
    `{name1}, there are no words perfect enough, but I will try. `,
    `Every time I think of you, {name1}, my world feels a little brighter. `,
    `They say time changes things, but my feelings for you only grow deeper, {name1}. `,
    `{name1}, you are the poetry I never knew how to write. `
  ];
  
  const bodies = {
    'Anniversary': [
      `Another beautiful year has passed, and you remain my greatest adventure. Every day with you is a gift I cherish. `,
      `Looking back, every moment spent with you has been a treasure. You make every year better than the last. `
    ],
    'Birthday': [
      `On this special day, the world was blessed with you. May this year bring you as much joy as you bring me. `,
      `Celebrating you today reminds me of how lucky I am. You deserve all the stars in the sky tonight. `
    ],
    'Valentine\'s Day': [
      `You are my everyday Valentine, the one who holds my heart completely. `,
      `Love is just a word until someone comes along and gives it meaning. You gave it meaning for me. `
    ],
    'Proposal': [
      `I want to spend all my tomorrows with you. You are my forever. `,
      `Life with you is a beautiful dream I never want to wake up from. Will you make it my reality forever? `
    ],
    'Good Morning': [
      `Waking up and knowing you are mine is the best way to start the day. `,
      `The sun is out, but you are the true light of my life today and always. `
    ],
    'Good Night': [
      `As the stars come out, my thoughts drift to you. Sleep well, my love. `,
      `Close your eyes and know that you are deeply loved, tonight and every night. `
    ],
    'Missing You': [
      `The distance means so little when someone means so much. I miss your smile. `,
      `Every second without you feels like a lifetime. I can't wait to hold you again. `
    ],
    'Just Because': [
      `I just wanted to remind you how incredibly special you are to me, today and always. `,
      `No special occasion, just my heart reminding me of how much I love you. `
    ]
  };

  const endings = [
    `Forever yours, {name2}.`,
    `With all my heart, {name2}.`,
    `Endlessly, {name2}.`,
    `Love always, {name2}.`
  ];

  const randomIntro = intros[Math.floor(Math.random() * intros.length)];
  const bodyPool = bodies[occasion] || bodies['Just Because'];
  const randomBody = bodyPool[Math.floor(Math.random() * bodyPool.length)];
  const randomEnding = endings[Math.floor(Math.random() * endings.length)];

  let msg = randomIntro + randomBody + randomEnding;
  return msg.replace(/{name1}/g, name1).replace(/{name2}/g, name2);
}

let currentMessageIndex = 0;

async function generateMessage() {
  const name1 = document.getElementById('name1').value.trim() || 'my love';
  const name2 = document.getElementById('name2').value.trim() || 'yours';
  const btn = document.getElementById('generateBtn');
  const outputArea = document.getElementById('outputArea');
  const outputMessage = document.getElementById('outputMessage');
  const outputNames = document.getElementById('outputNames');
  const outputOccTag = document.getElementById('outputOccTag');
  
  const photoUpload = document.getElementById('photoUpload');
  const outputPhotoContainer = document.getElementById('outputPhotoContainer');
  const outputPhoto = document.getElementById('outputPhoto');

  btn.classList.add('loading');
  btn.querySelector('.btn-gen-text').textContent = 'Crafting your message...';

  outputArea.classList.remove('visible');
  outputPhotoContainer.classList.remove('visible');

  await new Promise(r => setTimeout(r, 1400));

  // Process image if uploaded
  if (photoUpload && photoUpload.files && photoUpload.files[0]) {
    const file = photoUpload.files[0];
    const reader = new FileReader();
    
    const imageLoadPromise = new Promise(resolve => {
      reader.onload = function(e) {
        outputPhoto.src = e.target.result;
        outputPhotoContainer.classList.add('visible');
        resolve();
      };
    });
    
    reader.readAsDataURL(file);
    await imageLoadPromise;
  } else {
    outputPhoto.src = '';
    outputPhotoContainer.classList.remove('visible');
  }

  // Generate dynamic AI message
  const msg = generateMockAIMessage(name1, name2, selectedOccasion);

  outputOccTag.textContent = selectedOccasion;
  outputNames.textContent = `${name1} & ${name2}`;
  outputMessage.innerHTML = '';

  outputArea.classList.add('visible');

  btn.classList.remove('loading');
  btn.querySelector('.btn-gen-text').textContent = 'Generate My Message';

  // Typing effect
  await typeMessage(outputMessage, `"${msg}"`);

  // Scroll to output
  setTimeout(() => {
    outputArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 300);
}

// ===== FIX START =====
function downloadCard() {
  const card = document.getElementById('outputCard');
  if (!card) return;
  
  // Hide actions temporarily for clean capture
  const actions = card.querySelector('.output-actions');
  const originalDisplay = actions.style.display;
  actions.style.display = 'none';

  const photo = document.getElementById('outputPhoto');
  
  const performCapture = () => {
    // Ensure high quality capture while respecting device capabilities
    const isMobile = window.innerWidth <= 768;
    const renderScale = isMobile ? 2 : (window.devicePixelRatio > 1 ? window.devicePixelRatio : 2);

    html2canvas(card, {
      backgroundColor: '#0a0608', // Match website base background to fix transparency/tint issues
      scale: renderScale,
      useCORS: true,
      logging: false,
      allowTaint: true
    }).then(canvas => {
      actions.style.display = originalDisplay;
      
      // Use toBlob instead of toDataURL to handle large images better on mobile
      canvas.toBlob(function(blob) {
        if (!blob) {
          showToast('Oops, could not create image file.');
          return;
        }
        
        // If Web Share API is available and we're on mobile, try to share it natively
        if (isMobile && navigator.canShare && navigator.canShare({ files: [new File([blob], 'card.png', { type: blob.type })] })) {
          const file = new File([blob], `LoveCard_${Date.now()}.png`, { type: blob.type });
          navigator.share({
            files: [file],
            title: 'Love Card',
            text: 'Here is a beautiful love card for you!'
          }).then(() => {
            showToast('Love Card shared! ♥');
          }).catch(err => {
            triggerDownload(blob);
          });
        } else {
          triggerDownload(blob);
        }
      }, 'image/png');
    }).catch(err => {
      actions.style.display = originalDisplay;
      showToast('Oops, something went wrong.');
      console.error('html2canvas error:', err);
    });
  };

  // Ensure image is fully loaded before capture to prevent rendering issues
  if (photo && photo.src && !photo.complete) {
    photo.onload = performCapture;
  } else {
    performCapture();
  }
}

function triggerDownload(blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `LoveCard_${Date.now()}.png`;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  setTimeout(() => URL.revokeObjectURL(url), 100);
  showToast('Love Card downloaded! ♥');
}
// ===== FIX END =====

function typeMessage(el, text) {
  return new Promise(resolve => {
    el.innerHTML = '';
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    el.appendChild(cursor);

    let i = 0;
    const speed = 22;

    function type() {
      if (i < text.length) {
        el.insertBefore(document.createTextNode(text[i]), cursor);
        i++;
        setTimeout(type, speed);
      } else {
        setTimeout(() => {
          cursor.remove();
          resolve();
        }, 800);
      }
    }
    type();
  });
}

/* ========== COPY ========== */
function copyOutput() {
  const name1 = document.getElementById('name1').value.trim() || 'my love';
  const name2 = document.getElementById('name2').value.trim() || 'yours';
  const msg = document.getElementById('outputMessage').textContent;

  navigator.clipboard.writeText(msg).then(() => {
    showToast('Message copied to clipboard ✓');
  }).catch(() => {
    showToast('Please copy manually ↑');
  });
}

function shareWhatsApp() {
  const msg = document.getElementById('outputMessage').textContent;
  const encoded = encodeURIComponent(msg);
  window.open(`https://wa.me/?text=${encoded}`, '_blank');
}

function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ========== EXAMPLES DRAG / SCROLL ========== */
const track = document.getElementById('examplesTrack');
let isDown = false;
let startX;
let scrollLeft;

if (track) {
  track.addEventListener('mousedown', e => {
    isDown = true;
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
    track.style.cursor = 'grabbing';
  });
  track.addEventListener('mouseleave', () => { isDown = false; track.style.cursor = 'grab'; });
  track.addEventListener('mouseup', () => { isDown = false; track.style.cursor = 'grab'; });
  track.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    track.scrollLeft = scrollLeft - walk;
  });
}

function scrollExamples(dir) {
  const cardWidth = 380 + 24;
  track.scrollBy({ left: dir * cardWidth, behavior: 'smooth' });
}

/* ========== PARALLAX HERO ========== */
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.transform = `translateY(${scrollY * 0.25}px)`;
    heroContent.style.opacity = 1 - scrollY / 700;
  }
});

/* ========== SMOOTH ANCHOR SCROLL ========== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
