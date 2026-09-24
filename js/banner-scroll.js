// Expande o primeiro banner do projeto até à largura total durante o scroll.
(function initExpandingBanners() {
	var banners = document.querySelectorAll('[data-expand-banner]');
	if (!banners.length) return;

	var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
	var mobileScreen = window.matchMedia('(max-width: 767px)');
	var ticking = false;

	function clamp(value, min, max) {
		return Math.min(Math.max(value, min), max);
	}

	function easeInOut(progress) {
		return progress * progress * (3 - 2 * progress);
	}

	function getContainerWidth() {
		var container = document.querySelector('.lista-header.container');
		return container ? container.getBoundingClientRect().width : window.innerWidth * 0.9;
	}

	function updateBanner(banner) {
		var background = banner.querySelector('.ora-bg');
		if (!background) return;

		if (reduceMotion.matches || mobileScreen.matches) {
			background.style.removeProperty('--banner-width');
			background.style.removeProperty('--banner-height');
			background.style.removeProperty('--banner-top');
			return;
		}

		var rect = banner.getBoundingClientRect();
		var travel = Math.max(banner.offsetHeight - window.innerHeight, 1);
		var progress = easeInOut(clamp(-rect.top / travel, 0, 1));
		var startWidth = Math.min(getContainerWidth(), window.innerWidth);
		var width = startWidth + (window.innerWidth - startWidth) * progress;
		var height = window.innerHeight * (0.8 + 0.2 * progress);
		var top = window.innerHeight * 0.1 * (1 - progress);

		background.style.setProperty('--banner-width', width + 'px');
		background.style.setProperty('--banner-height', height + 'px');
		background.style.setProperty('--banner-top', top + 'px');
	}

	function updateAll() {
		banners.forEach(updateBanner);
		ticking = false;
	}

	function requestUpdate() {
		if (ticking) return;
		ticking = true;
		window.requestAnimationFrame(updateAll);
	}

	window.addEventListener('scroll', requestUpdate, { passive: true });
	window.addEventListener('resize', requestUpdate);
	reduceMotion.addEventListener('change', requestUpdate);
	mobileScreen.addEventListener('change', requestUpdate);
	requestUpdate();
})();
