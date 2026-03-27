<?php
namespace VamtamElementor\Widgets\NavMenu;

use \ElementorPro\Modules\NavMenu\Widgets\Nav_Menu as Elementor_Nav_Menu;

// Extending the Nav Menu widget.

// Is Pro Widget.
if ( ! \VamtamElementorIntregration::is_elementor_pro_active() ) {
	return;
}

// Theme preferences.
if ( ! \Vamtam_Elementor_Utils::is_widget_mod_active( 'nav-menu' ) ) {
	return;
}

// Vamtam_Widget_Nav_Menu.
function widgets_registered() {
	if ( ! \VamtamElementorIntregration::is_elementor_pro_active() ) {
		return;
	}

	if ( ! class_exists( '\ElementorPro\Modules\NavMenu\Widgets\Nav_Menu' ) ) {
		return; // Elementor's autoloader acts weird sometimes.
	}

	class Vamtam_Widget_Nav_Menu extends Elementor_Nav_Menu {
		public $extra_depended_scripts = [
			'vamtam-nav-menu',
		];

		/*
			We override the get_script_depends method directly because Elementor's
			Elementor_Nav_Menu class returns the array directly, like so:

				public function get_script_depends() {
					return [ 'smartmenus' ];
				}

			If this changes, we should update this and probably filter the script in the
			add_extra_script_depends method.
		*/

		public function get_script_depends() {
			return [
				'smartmenus',
				'vamtam-nav-menu',
			];
		}

		// Extend constructor.
		public function __construct($data = [], $args = null) {
			parent::__construct($data, $args);
			$this->register_assets();

			$this->add_extra_script_depends();
		}

		// Register the assets the widget depends on.
		public function register_assets() {
			$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

			wp_register_script(
				'vamtam-nav-menu',
				VAMTAM_ELEMENTOR_INT_URL . 'assets/js/widgets/nav-menu/vamtam-nav-menu' . $suffix . '.js',
				[
					'elementor-frontend'
				],
				\VamtamElementorIntregration::PLUGIN_VERSION,
				true
			);
		}

		// Assets the widget depends upon.
		public function add_extra_script_depends() {
			// Scripts
			foreach ( $this->extra_depended_scripts as $script ) {
				$this->add_script_depends( $script );
			}
		}
	}

	// Replace current products widget with our extended version.
	$widgets_manager = \Elementor\Plugin::instance()->widgets_manager;
	$widgets_manager->unregister( 'nav-menu' );
	$widgets_manager->register( new Vamtam_Widget_Nav_Menu );
}
add_action( \Vamtam_Elementor_Utils::get_widgets_registration_hook(), __NAMESPACE__ . '\widgets_registered', 100 );
