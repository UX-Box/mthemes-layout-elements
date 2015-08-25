<?php 
/*
Plugin Name: Mountain Themes Layout Elements
Plugin URI:  http://mountainthemes.com
Description: Lorem Ipsum
Version:     0.0.1
Author:      Luca Bertaiola
Author URI:  http://luglio7.com
License:     GPL2
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Domain Path: /languages
Text Domain: mthemes
*/

defined( 'ABSPATH' ) or die('No script kiddies please!'); 

define('MTHEMES_LAYOUT_ELEMENTS_VERSION', '0.0.1');
define('MTHEMES_LAYOUT_ELEMENTS_BASE_FILE', __FILE__);
define('MTHEMES_LAYOUT_ELEMENTS_PATH', plugins_url('mthemes-layout-elements'));

global $mthemes_layout_elements_widgets;

$mthemes_layout_elements_widgets = array();

require_once plugin_dir_path(__FILE__) . 'fields/import.php';
require_once plugin_dir_path(__FILE__) . 'filters/acf.php';
require_once plugin_dir_path(__FILE__) . 'actions/wp.php';
require_once plugin_dir_path(__FILE__) . 'utilities/functions.php';
require_once plugin_dir_path(__FILE__) . 'widgets/mthemes-widget.php';
require_once plugin_dir_path(__FILE__) . 'widgets/mthemes-image-widget.php';