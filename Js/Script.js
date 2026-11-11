/* ================= BOOT SCREEN ================= */
const bootLines = [
    '> INICIALIZANDO NEO_OS v2.0.7...',
    '> CARGANDO MODULOS DEL SISTEMA [OK]',
    '> VERIFICANDO INTEGRIDAD............ [OK]',
    '> ESTABLECIENDO CONEXION SEGURA...... [OK]',
    '> ACCESO CONCEDIDO.',
    '',
    '  BIENVENIDO AL PORTAFOLIO_'
];
const bootEl = document.getElementById('boot-text');
const bootBox = document.getElementById('boot');
let bootDone = false;

async function runBoot() {
    for (const line of bootLines) {
        if (bootDone) return;
        for (const ch of line) {
            if (bootDone) return;
            bootEl.textContent += ch;
            await new Promise(r => setTimeout(r, 14));
        }
        bootEl.textContent += '\n';
        await new Promise(r => setTimeout(r, 90));
    }
    setTimeout(endBoot, 450);
}
function endBoot() {
    if (bootDone) return;
    bootDone = true;
    bootBox.classList.add('done');
    startTyping();
}
bootBox.addEventListener('click', endBoot);
runBoot();
setTimeout(endBoot, 4000); // failsafe

/* ================= TEXTO TIPO TERMINAL ================= */
const phrases = [
    'Desarrollador Full-Stack',
    'Diseñador de Interfaces',
    'Explorador de la Web',
    'Creador de Experiencias'
];
const typedEl = document.getElementById('typed');
let pIdx = 0, cIdx = 0, deleting = false, typingStarted = false;

function startTyping() {
    if (typingStarted) return;
    typingStarted = true;
    loopType();
}
function loopType() {
    const word = phrases[pIdx];
    if (!deleting) {
        typedEl.textContent = word.slice(0, ++cIdx);
        if (cIdx === word.length) {
            deleting = true;
            return setTimeout(loopType, 1700);
        }
        setTimeout(loopType, 70);
    } else {
        typedEl.textContent = word.slice(0, --cIdx);
        if (cIdx === 0) {
            deleting = false;
            pIdx = (pIdx + 1) % phrases.length;
            return setTimeout(loopType, 350);
        }
        setTimeout(loopType, 32);
    }
}

/* ================= MATRIX RAIN ================= */
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');
const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF<>{}[]/*#';
let cols, drops;

function resizeCanvas() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    cols = Math.floor(canvas.width / 18);
    drops = new Array(cols).fill(0).map(() => Math.random() * -100);
}
resizeCanvas();
addEventListener('resize', resizeCanvas);

function drawMatrix() {
    ctx.fillStyle = 'rgba(5,6,10,0.09)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '15px monospace';
    for (let i = 0; i < drops.length; i++) {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = Math.random() > 0.97 ? '#ff00a0' : '#00f0ff';
        ctx.fillText(ch, i * 18, drops[i] * 18);
        if (drops[i] * 18 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    }
}
setInterval(drawMatrix, 62);

/* ================= CURSOR ================= */
const ring = document.getElementById('ring');
const dot = document.getElementById('dot');
let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;

addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
});

function animateRing() {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, .card, .skill, .btn').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('active'));
    el.addEventListener('mouseleave', () => ring.classList.remove('active'));
});

/* ================= REVEAL ON SCROLL ================= */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ================= NAV: OCULTAR AL BAJAR ================= */
let lastY = 0;
const nav = document.querySelector('.nav');
addEventListener('scroll', () => {
    const y = scrollY;
    if (y > lastY && y > 220) {
        nav.style.transform = 'translateY(-110%)';
    } else {
        nav.style.transform = 'translateY(0)';
    }
    lastY = y;
});
nav.style.transition = 'transform .4s cubic-bezier(.2,.8,.2,1)';

/* =========================================================
   ANIMACIONES DE ENTRADA — IntersectionObserver
   ========================================================= */
const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            animObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('[data-anim]').forEach(el => animObserver.observe(el));


/* =========================================================
   RIPPLE EN BOTONES
   ========================================================= */
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top  = (e.clientY - rect.top  - size / 2) + 'px';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);
    });
});


/* =========================================================
   NAV ACTIVO SEGÚN SECCIÓN VISIBLE
   ========================================================= */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav nav a');

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === '#' + id);
            });
        }
    });
}, { threshold: 0.35 });

sections.forEach(s => navObserver.observe(s));


/* =========================================================
   FORM → WHATSAPP
   ========================================================= */
// 👇 Poné tu número con código de país, SIN "+", SIN espacios ni guiones.
// Argentina CABA: +54 9 11 2345-6789  →  '5491123456789'
const WHATSAPP_NUMBER = '5493764943233';

const form = document.getElementById('contact-form');
const note = document.getElementById('form-note');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre   = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const correo   = document.getElementById('correo').value.trim();
    const mensaje  = document.getElementById('mensaje').value.trim();

    if (!nombre || !telefono || !mensaje) {
        note.textContent = '⚠ Completá los campos obligatorios (*)';
        note.className   = 'form-note err';
        return;
    }

    const texto =
        `Hola Mauricio 👋 Te escribo desde tu portafolio.\n\n` +
        `*Nombre:* ${nombre}\n` +
        `*Teléfono:* ${telefono}\n` +
        (correo ? `*Correo:* ${correo}\n` : '') +
        `\n*Mensaje:*\n${mensaje}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank', 'noopener');

    note.textContent = '✓ Abriendo WhatsApp...';
    note.className   = 'form-note ok';
    form.reset();

    setTimeout(() => {
        note.textContent = 'Se abrirá WhatsApp con tu mensaje listo para enviar.';
        note.className   = 'form-note';
    }, 4000);
});
