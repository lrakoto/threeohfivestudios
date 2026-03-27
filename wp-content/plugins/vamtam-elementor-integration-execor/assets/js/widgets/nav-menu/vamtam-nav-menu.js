class VamtamNavMenu extends elementorModules.frontend.handlers.Base {

	onInit( ...args ) {
		super.onInit( ...args );

		this.submenuIconFix();
	}

	submenuIconFix() {
		const elementSettings = this.getElementSettings(),
			iconValue = elementSettings.submenu_icon.value;

		if (iconValue && iconValue !== '<i class=""></i>') {
			this.$element.addClass('vamtam-has-submenu-icon');
		}
	}
}

jQuery( window ).on( 'elementor/frontend/init', () => {
	if ( ! elementorFrontend.elementsHandler || ! elementorFrontend.elementsHandler.attachHandler ) {
		const addHandler = ( $element ) => {
			elementorFrontend.elementsHandler.addHandler( VamtamNavMenu, {
				$element,
			} );
		};

		elementorFrontend.hooks.addAction( 'frontend/element_ready/nav-menu.default', addHandler, 100 );
	} else {
		elementorFrontend.elementsHandler.attachHandler( 'nav-menu', VamtamNavMenu );
	}
} );
