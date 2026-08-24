// Enquanto uma secção .work-cards-viewport estiver totalmente visível, a roda
// do rato move a faixa de cards (transform) em vez de dar scroll vertical à
// página. Quando o scroll horizontal chega ao fim (ou ao início), o scroll
// vertical retoma. Funciona para qualquer número de secções na página.
(function initWorkCardsScroll() {
	var viewports = document.querySelectorAll('.work-cards-viewport');

	viewports.forEach(function (viewport) {
		var track = viewport.firstElementChild;
		if (!track) return;

		var progress = 0; // 0 = início da faixa, 1 = fim da faixa
		var maxScroll = 0;
		var baseOffset = 0; // centra a faixa quando ela cabe toda no ecrã

		function recalc() {
			maxScroll = Math.max(track.scrollWidth - viewport.clientWidth, 0);
			baseOffset = maxScroll > 0 ? 0 : (viewport.clientWidth - track.scrollWidth) / 2;
		}

		function render() {
			track.style.transform = 'translateX(' + (baseOffset - progress * maxScroll) + 'px)';
		}

		// Calculado a cada evento, sem depender de um estado assíncrono que possa
		// ficar desatualizado num scroll rápido e "prender" a página.
		function isFullyVisible() {
			var rect = viewport.getBoundingClientRect();
			return rect.top >= 0 && rect.bottom <= window.innerHeight;
		}

		window.addEventListener('wheel', function (e) {
			if (maxScroll <= 0 || !isFullyVisible()) return;

			var goingDown = e.deltaY > 0;
			if ((goingDown && progress < 1) || (!goingDown && progress > 0)) {
				e.preventDefault();
				progress = Math.min(1, Math.max(0, progress + e.deltaY / maxScroll));
				render();
			}
		}, { passive: false });

		window.addEventListener('resize', function () {
			recalc();
			render();
		});

		recalc();
		render();
	});
})();
