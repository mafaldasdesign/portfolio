// Imagens flutuantes com reação suave à posição do rato.
(function initAboutFloatingImages() {
	var section = document.querySelector('.hp-about');
	var images = document.querySelectorAll('.about-float');
	if (!section || !images.length) return;

	var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
	var depths = [1, -0.7, 1.35];
	var targetX = 0;
	var targetY = 0;
	var currentX = 0;
	var currentY = 0;

	section.addEventListener('mousemove', function (event) {
		if (reduceMotion.matches) return;

		var rect = section.getBoundingClientRect();
		var normalX = (event.clientX - rect.left) / rect.width - 0.5;
		var normalY = (event.clientY - rect.top) / rect.height - 0.5;

		targetX = normalX * 44;
		targetY = normalY * 34;
	});

	section.addEventListener('mouseleave', function () {
		targetX = 0;
		targetY = 0;
	});

	function animate() {
		if (reduceMotion.matches) {
			targetX = 0;
			targetY = 0;
		}

		currentX += (targetX - currentX) * 0.08;
		currentY += (targetY - currentY) * 0.08;

		images.forEach(function (image, index) {
			image.style.setProperty('--mouse-x', currentX * depths[index] + 'px');
			image.style.setProperty('--mouse-y', currentY * depths[index] + 'px');
		});

		window.requestAnimationFrame(animate);
	}

	animate();
})();
