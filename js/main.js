// Mafalda Reis — Portfólio
// Índice: preloader · scroll suave · menu · cursor · hero · botões · serviços
//         projetos · testemunho · pop-ups · títulos letra a letra · contacto · formulários

const root = document.documentElement;
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const clamp01 = (v) => Math.min(Math.max(v, 0), 1);

// Tudo o que depende do scroll corre num único ciclo, uma vez por frame
const scrollTasks = [];
let scrollQueued = false;
const runScrollTasks = () => { scrollTasks.forEach((task) => task()); scrollQueued = false; };
const onScroll = (task) => { scrollTasks.push(task); task(); };
window.addEventListener('scroll', () => {
	if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(runScrollTasks); }
}, { passive: true });
window.addEventListener('resize', runScrollTasks);


// ---------- Preloader: conta de 0 a 100% (imagens + letras), com duração mínima, e depois dissolve-se ----------
(() => {
	const preloader = document.querySelector('.preloader');
	const num = preloader.querySelector('.preloader__num');
	const MIN_TIME = prefersReduced ? 0 : 1600;

	const images = [...document.images].filter((img) => img.loading !== 'lazy');
	const total = images.length + 1; // + as letras
	let loaded = 0;
	const tick = () => { loaded = Math.min(loaded + 1, total); };
	images.forEach((img) => {
		if (img.complete) tick();
		else { img.addEventListener('load', tick, { once: true }); img.addEventListener('error', tick, { once: true }); }
	});
	document.fonts.ready.then(tick);

	const start = performance.now();
	let shown = 0;
	let finished = false;

	const finish = () => {
		if (finished) return;
		finished = true;
		num.textContent = '100';
		setTimeout(() => preloader.classList.add('is-done'), prefersReduced ? 0 : 250);
		setTimeout(() => {
			root.classList.remove('is-loading'); // arrancam as animações do hero
			window.lenis?.start();
		}, prefersReduced ? 0 : 1150);
		setTimeout(() => preloader.remove(), 1600);
	};

	const step = (now) => {
		if (finished) return;
		const timeFrac = MIN_TIME ? Math.min((now - start) / MIN_TIME, 1) : 1;
		const target = Math.min(loaded / total, timeFrac) * 100;
		shown += (target - shown) * 0.12;
		if (target === 100 && shown > 99.5) return finish();
		num.textContent = String(Math.floor(shown));
		requestAnimationFrame(step);
	};
	requestAnimationFrame(step);
	setTimeout(finish, 7000); // nunca fica preso mais de 7s
})();


// ---------- Scroll suave e lento (Lenis) ----------
let lenis = null;
if (window.Lenis && !prefersReduced) {
	lenis = new Lenis({ lerp: 0.07, wheelMultiplier: 0.9 });
	window.lenis = lenis;
	if (root.classList.contains('is-loading')) lenis.stop(); // parado durante o preloader
	const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
	requestAnimationFrame(raf);
}

const scrollToY = (top) => {
	if (lenis) lenis.scrollTo(top, { duration: 1.6 });
	else window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
};

// impede que a roda / o dedo façam scroll à página por trás de um painel aberto
const lockScrollBehind = (panel, scroller = panel) => {
	const block = (event) => { if (scroller.scrollHeight <= scroller.clientHeight) event.preventDefault(); };
	panel.addEventListener('wheel', block, { passive: false });
	panel.addEventListener('touchmove', block, { passive: false });
};


// ---------- Menu ----------
// header ganha fundo depois de fazer scroll
const header = document.querySelector('.site-header');
onScroll(() => header.classList.toggle('is-scrolled', window.scrollY > 40));

// menu do telemóvel ("bubble menu")
const bubbleToggle = document.querySelector('.bubble--toggle');
const bubbleMenu = document.querySelector('.bubble-menu');
const setMenu = (open) => {
	document.body.classList.toggle('menu-open', open);
	bubbleToggle.setAttribute('aria-expanded', String(open));
	bubbleToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
	bubbleMenu.setAttribute('aria-hidden', String(!open));
	if (lenis) open ? lenis.stop() : lenis.start();
};
bubbleToggle.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
bubbleMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
lockScrollBehind(bubbleMenu);

// links internos (#secção) passam pelo scroll suave; o #contacto é tratado mais abaixo
document.querySelectorAll('a[href^="#"]:not([href="#contacto"])').forEach((link) => {
	link.addEventListener('click', (event) => {
		const target = document.querySelector(link.getAttribute('href'));
		if (!target) return;
		event.preventDefault();
		scrollToY(target.getBoundingClientRect().top + window.scrollY);
	});
});


// ---------- Cursor: bolinha que inverte as cores por baixo (CSS) e cresce em links/botões ----------
if (hasMouse) {
	const cursor = document.createElement('div');
	cursor.className = 'cursor is-hidden';
	cursor.setAttribute('aria-hidden', 'true');
	document.body.appendChild(cursor);
	root.classList.add('has-cursor');

	let x = -100, y = -100, cx = x, cy = y;
	window.addEventListener('pointermove', (event) => {
		x = event.clientX;
		y = event.clientY;
		cursor.classList.remove('is-hidden');
		cursor.classList.toggle('is-hover', !!event.target.closest?.('a, button, input, textarea, label'));
	}, { passive: true });
	document.addEventListener('mouseout', (event) => { if (!event.relatedTarget) cursor.classList.add('is-hidden'); });

	const ease = prefersReduced ? 1 : 0.25; // pequeno atraso suave
	const follow = () => {
		cx += (x - cx) * ease;
		cy += (y - cy) * ease;
		cursor.style.setProperty('--cx', `${cx}px`);
		cursor.style.setProperty('--cy', `${cy}px`);
		requestAnimationFrame(follow);
	};
	follow();
}


// ---------- Hero: a palavra azul vai trocando e a largura ajusta-se a cada uma ----------
const rotator = document.querySelector('.rotator');
if (rotator) {
	const words = rotator.dataset.words.split(',').map((w) => w.trim());
	let index = 0;
	let current = rotator.querySelector('.rotator__word');
	// largura exata + 2px de folga, para a última letra nunca ficar cortada
	const fitWidth = () => { rotator.style.width = `${Math.ceil(current.getBoundingClientRect().width) + 2}px`; };

	const next = () => {
		index = (index + 1) % words.length;
		const incoming = document.createElement('span');
		incoming.className = 'rotator__word';
		incoming.textContent = words[index];
		rotator.appendChild(incoming);

		const leaving = current;
		leaving.classList.replace('is-current', 'is-leaving');
		setTimeout(() => leaving.remove(), 800);

		current = incoming;
		requestAnimationFrame(() => requestAnimationFrame(() => {
			incoming.classList.add('is-current');
			fitWidth();
		}));
	};

	document.fonts.ready.then(fitWidth);
	window.addEventListener('resize', fitWidth);
	if (!prefersReduced) setInterval(next, 2600);
}


// ---------- Botões: o círculo de preenchimento nasce (e sai) no ponto onde está o rato ----------
document.querySelectorAll('.btn').forEach((btn) => {
	const setOrigin = (event) => {
		const r = btn.getBoundingClientRect();
		btn.style.setProperty('--x', `${event.clientX - r.left}px`);
		btn.style.setProperty('--y', `${event.clientY - r.top}px`);
		btn.style.setProperty('--d', `${Math.hypot(r.width, r.height) * 2}px`);
	};
	btn.addEventListener('pointerenter', (e) => { setOrigin(e); btn.classList.add('is-hovered'); });
	btn.addEventListener('pointerleave', (e) => { setOrigin(e); btn.classList.remove('is-hovered'); });
});


// ---------- Serviços: cada linha abre ao clicar (e fecha as outras) ----------
const services = document.querySelectorAll('.service');
services.forEach((service) => {
	service.querySelector('.service__head').addEventListener('click', () => {
		const open = !service.classList.contains('is-open');
		services.forEach((s) => {
			const isThis = s === service && open;
			s.classList.toggle('is-open', isThis);
			s.querySelector('.service__head').setAttribute('aria-expanded', String(isThis));
		});
	});
});


// ---------- Projetos: a secção fica presa e cada "ecrã" de scroll mostra o projeto seguinte ----------
const projects = document.querySelector('.projects');
if (projects) {
	const groups = [projects.querySelectorAll('.slide'), projects.querySelectorAll('.info'), projects.querySelectorAll('.projects__dots li')];
	const counter = projects.querySelector('.projects__current');
	const count = groups[0].length;
	let active = -1;

	onScroll(() => {
		const rect = projects.getBoundingClientRect();
		const progress = Math.min(clamp01(-rect.top / (rect.height - window.innerHeight)), 0.9999);
		const index = Math.floor(progress * count);
		if (index === active) return;
		active = index;
		groups.forEach((group) => group.forEach((el, i) => {
			el.classList.toggle('is-active', i === index);
			el.classList.toggle('is-past', i < index);
		}));
		counter.textContent = String(index + 1).padStart(2, '0');
	});
}


// ---------- Testemunho: as palavras ganham nitidez uma a uma com o scroll e o bloco endireita-se ----------
const quote = document.querySelector('.testimonial__quote');
if (quote && !prefersReduced) {
	const text = quote.textContent.trim();
	quote.setAttribute('aria-label', text);
	quote.innerHTML = text.split(/\s+/).map((w) => `<span class="sr-word" aria-hidden="true">${w}</span>`).join(' ');
	const spans = [...quote.querySelectorAll('.sr-word')];

	onScroll(() => {
		const rect = quote.getBoundingClientRect();
		const vh = window.innerHeight;
		const start = vh * 0.95;               // o topo do texto entra pelo fundo do ecrã
		const end = vh * 0.55 - rect.height;   // o fim do texto chega a 55% do ecrã
		const p = clamp01((start - rect.top) / (start - end));
		quote.style.setProperty('--sr-rotate', `${(1 - p) * 3}deg`);
		spans.forEach((span, i) => {
			const t = clamp01(p * spans.length * 1.15 - i); // cada palavra tem a sua vez
			span.style.opacity = (0.12 + 0.88 * t).toFixed(3);
			span.style.filter = t < 1 ? `blur(${(4 * (1 - t)).toFixed(2)}px)` : 'none';
		});
	});
}


// ---------- Pop-ups: abrem num círculo a partir do ponto clicado; as imagens vão passando em dissolve ----------
let openModal = null;
let slideTimer = null;
let lastFocus = null;

const showModal = (id, origin) => {
	const modal = document.querySelector(`.pmodal[data-modal-id="${id}"]`);
	if (!modal) return;
	modal.style.setProperty('--ox', `${origin.x}px`);
	modal.style.setProperty('--oy', `${origin.y}px`);
	lastFocus = document.activeElement;
	openModal = modal;
	modal.hidden = false;
	modal.getBoundingClientRect(); // garante que a animação de abertura corre
	modal.classList.add('is-open');
	lenis?.stop(); // trava a página sem mexer no overflow (isso fazia a secção presa "saltar")
	modal.querySelector('.pmodal__close').focus({ preventScroll: true });

	// a cada 3s entra a imagem seguinte, por cima da anterior
	const slides = [...modal.querySelectorAll('.pm-slide')];
	let i = 0;
	slides.forEach((s, k) => { s.classList.toggle('is-active', k === 0); s.classList.remove('is-prev'); });
	clearInterval(slideTimer);
	if (slides.length > 1 && !prefersReduced) {
		slideTimer = setInterval(() => {
			slides.forEach((s) => s.classList.remove('is-prev'));
			slides[i].classList.replace('is-active', 'is-prev');
			i = (i + 1) % slides.length;
			slides[i].classList.add('is-active');
		}, 3000);
	}
};

const hideModal = () => {
	if (!openModal) return;
	const modal = openModal;
	openModal = null;
	clearInterval(slideTimer);
	modal.classList.remove('is-open');
	lenis?.start();
	setTimeout(() => { if (!modal.classList.contains('is-open')) modal.hidden = true; }, prefersReduced ? 0 : 1000);
	lastFocus?.focus({ preventScroll: true });
};

document.querySelectorAll('[data-modal]').forEach((trigger) => {
	trigger.addEventListener('click', (event) => {
		event.preventDefault();
		const r = trigger.getBoundingClientRect();
		const fromPointer = event.clientX || event.clientY; // com o teclado não há ponto: usa o centro do botão
		showModal(trigger.dataset.modal, {
			x: fromPointer ? event.clientX : r.left + r.width / 2,
			y: fromPointer ? event.clientY : r.top + r.height / 2
		});
	});
});
document.querySelectorAll('.pmodal').forEach((modal) => {
	const win = modal.querySelector('.pmodal__window');
	win.setAttribute('data-lenis-prevent', ''); // deixa fazer scroll dentro do pop-up
	lockScrollBehind(modal, win);
	modal.querySelector('.pmodal__close').addEventListener('click', hideModal);
});
document.addEventListener('keydown', (event) => {
	if (event.key !== 'Escape') return;
	hideModal();
	setMenu(false);
});


// ---------- Títulos letra a letra (dentro de palavras, para não partirem a meio) ----------
document.querySelectorAll('.split-text').forEach((el) => {
	const text = el.textContent.trim().replace(/\s+/g, ' ');
	el.setAttribute('aria-label', text);
	let ci = 0;
	el.innerHTML = text.split(' ').map((word) => {
		const chars = [...word].map((c) => `<span class="st-char" style="--ci:${ci++}">${c}</span>`).join('');
		return `<span class="st-word" aria-hidden="true">${chars}</span>`;
	}).join(' ');
});

// elementos aparecem ao entrar no ecrã
const io = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		if (!entry.isIntersecting) return;
		entry.target.classList.add('is-visible');
		io.unobserve(entry.target);
	});
}, { threshold: 0.15 });
document.querySelectorAll('.reveal, .split-text').forEach((el) => io.observe(el));


// ---------- Contacto: a janela abre conforme o scroll (--p vai de 0 a 1) ----------
const reveal = document.querySelector('.contact-reveal');
if (prefersReduced) {
	reveal.style.setProperty('--p', 1);
} else {
	onScroll(() => {
		const rect = reveal.getBoundingClientRect();
		const vh = window.innerHeight;
		// começa a abrir quando a janela chega a meio do ecrã e acaba antes do fim da "pista"
		const p = clamp01((vh * 0.5 - rect.top) / (rect.height - vh * 0.6));
		reveal.style.setProperty('--p', (1 - (1 - p) ** 3).toFixed(4)); // easeOutCubic
	});
}
// links para #contacto levam ao ponto em que a janela já está toda aberta
document.querySelectorAll('a[href="#contacto"]').forEach((link) => {
	link.addEventListener('click', (event) => {
		event.preventDefault();
		scrollToY(reveal.getBoundingClientRect().bottom + window.scrollY - window.innerHeight);
	});
});


// ---------- Formulários: abrem o e-mail com os dados preenchidos ----------
const CONTACT_EMAIL = 'mafaldas.design@gmail.com';
document.querySelectorAll('.js-contact-form').forEach((form) => {
	form.addEventListener('submit', (event) => {
		event.preventDefault();
		const data = new FormData(form);
		const projeto = data.get('projeto'); // só existe nos pop-ups dos projetos
		const subject = projeto ? `Gostei do projeto ${projeto} — ${data.get('nome')}` : `Novo projeto — ${data.get('nome')}`;
		const body = `${data.get('mensagem') || ''}\n\n${data.get('nome')}\n${data.get('email')}`;
		window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
	});
});
