<?php 

// widget activation

function mthemes_layout_elements_register_widgets () {
  global $mthemes_layout_elements_widgets;
  global $pagenow;

  $register_widgets = false;

  // register widgets only on post.php and front end pages

  if (is_admin()) {
    if( array_search($pagenow, array('widgets.php', 'customize.php')) === false ){
      $register_widgets = true;
    }
  }
  else {
    $register_widgets = true;
  }

  if ($register_widgets) {
    foreach($mthemes_layout_elements_widgets as $mthemes_widget){
      if(class_exists($mthemes_widget)){
        register_widget($mthemes_widget);
      }
    }
  }
}

add_action('widgets_init', 'mthemes_layout_elements_register_widgets', 0);


// plugin styles and scripts

function mthemes_admin_enqueue_scripts () {
  wp_register_style('mthemes-layout-elements', MTHEMES_LAYOUT_ELEMENTS_PATH . '/assets/css/mthemes-layout-elements.css', false, '1.0.0');
  wp_register_script('mthemes-layout-elements', MTHEMES_LAYOUT_ELEMENTS_PATH . '/assets/js/mthemes-layout-elements.js', false, '1.0.0', true);

  wp_enqueue_style('mthemes-layout-elements');
  wp_enqueue_script('mthemes-layout-elements');
}

add_action('admin_enqueue_scripts', 'mthemes_admin_enqueue_scripts');


// requirements notices

function mthemes_layout_elements_admin_notices () {
  $acf_active = is_plugin_active('advanced-custom-fields-pro/acf.php');
  $sop_active = is_plugin_active('siteorigin-panels/siteorigin-panels.php');

  if (!$acf_active) {
    ?>
    <div class="error"><p><?php echo __('Mountain Themes Layout Elements requires Advanced Custom Fielfd Pro', 'mthemes') ?></p></div>
    <?php
  }

  if (!$sop_active) {
    ?>
    <div class="error"><p><?php echo __('Mountain Themes Layout Elements requires Site Origin Page Builder', 'mthemes') ?></p></div>
    <?php
  }
}

add_action('admin_notices', 'mthemes_layout_elements_admin_notices' );