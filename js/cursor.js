// Cursor personalizado: bolinha que reage ao fundo através de mix-blend-mode.
(function initCustomCursor() {
	// Em dispositivos táteis mantém o comportamento normal.
	if (!window.matchMedia('(pointer: fine)').matches) return;

	var circle = document.querySelector('.custom-cursor');
	if (!circle) {
		circle = document.createElement('div');
		circle.className = 'custom-cursor is-hidden';
		circle.setAttribute('aria-hidden', 'true');
		document.body.appendChild(circle);
	}

	document.body.classList.add('cursor-ready');

	document.addEventListener('mousemove', function (e) {
		circle.style.transform = 'translate3d(' + e.clientX + 'px, ' + e.clientY + 'px, 0) translate(-50%, -50%)';
		circle.classList.remove('is-hidden');
	});

	document.addEventListener('mouseleave', function () {
		circle.classList.add('is-hidden');
	});
	document.addEventListener('mouseenter', function () {
		circle.classList.remove('is-hidden');
	});

	var interactive = document.querySelectorAll('a, button, input, textarea, select, [role="button"]');
	interactive.forEach(function (el) {
		el.addEventListener('mouseenter', function () {
			circle.classList.add('is-large');
		});
		el.addEventListener('mouseleave', function () {
			circle.classList.remove('is-large');
		});
	});
})();
