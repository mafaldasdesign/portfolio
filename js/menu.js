// Menu de ecrã inteiro: ao clicar em "MENU" no header, a página encolhe e
// desloca-se para a esquerda enquanto um painel com a navegação desliza
// da direita — inspirado na animação de designbybrandin.com
(function initOffcanvasMenu() {
	var toggle = document.getElementById('menuToggle');
	var menu = document.getElementById('offcanvasMenu');
	var closeBtn = menu ? menu.querySelector('.offcanvas-close') : null;
	var pageWrap = document.querySelector('.page-wrap');
	if (!toggle || !menu) return;

	function open() {
		// centra o encolher da página no que está visível no ecrã nesse
		// momento (ex: o banner), em vez do centro de toda a página, que é
		// muito mais alta do que o ecrã
		if (pageWrap) {
			var originY = window.scrollY + window.innerHeight / 2;
			pageWrap.style.transformOrigin = '50% ' + originY + 'px';
		}
		document.body.classList.add('menu-open');
		toggle.textContent = 'CLOSE';
	}

	function close() {
		document.body.classList.remove('menu-open');
		toggle.textContent = 'MENU';
	}

	toggle.addEventListener('click', function (e) {
		e.preventDefault();
		if (document.body.classList.contains('menu-open')) {
			close();
		} else {
			open();
		}
	});

	if (closeBtn) closeBtn.addEventListener('click', close);

	menu.querySelectorAll('a').forEach(function (link) {
		link.addEventListener('click', close);
	});

	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape') close();
	});
})();
