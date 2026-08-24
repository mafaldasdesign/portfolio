// Ao passar o rato num circle da secção "about me": mostra o título (via CSS,
// :hover) e troca a bolinha do cursor por uma imagem própria de cada círculo.
(function initAboutCircles() {
	var dot = document.querySelector('.custom-cursor');
	var cursorImage = document.querySelector('.cursor-image');
	var circles = document.querySelectorAll('.about-circle .circle');
	if (!dot || !cursorImage || !circles.length) return;

	document.addEventListener('mousemove', function (e) {
		cursorImage.style.left = e.clientX + 'px';
		cursorImage.style.top = e.clientY + 'px';
	});

	circles.forEach(function (circle) {
		circle.addEventListener('mouseenter', function () {
			cursorImage.src = circle.dataset.img || '';
			cursorImage.alt = circle.dataset.title || '';
			cursorImage.classList.add('is-visible');
			dot.classList.add('is-hidden');
		});
		circle.addEventListener('mouseleave', function () {
			cursorImage.classList.remove('is-visible');
			dot.classList.remove('is-hidden');
		});
	});
})();
