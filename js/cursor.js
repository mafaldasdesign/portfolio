// Cursor personalizado: bolinha que troca de cor consoante o fundo (pixel a pixel, via mix-blend-mode)
(function initCustomCursor() {
	// Em ecrãs táteis não há cursor a seguir, por isso não corre
	if (window.matchMedia('(pointer: coarse)').matches) return;

	var circle = document.querySelector('.custom-cursor');
	if (!circle) return;

	document.body.classList.add('cursor-ready');

	document.addEventListener('mousemove', function (e) {
		circle.style.left = e.clientX + 'px';
		circle.style.top = e.clientY + 'px';
	});

	document.addEventListener('mouseleave', function () {
		circle.classList.add('is-hidden');
	});
	document.addEventListener('mouseenter', function () {
		circle.classList.remove('is-hidden');
	});

	var interactive = document.querySelectorAll('a, button');
	interactive.forEach(function (el) {
		el.addEventListener('mouseenter', function () {
			circle.classList.add('is-large');
		});
		el.addEventListener('mouseleave', function () {
			circle.classList.remove('is-large');
		});
	});
})();
