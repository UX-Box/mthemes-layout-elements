<?php 

// load acf default fields

function mthemes_layout_elements_acf_load_json ($paths) {

  if(is_array($paths)){
    $paths[] = dirname(plugin_dir_path(__FILE__)) . '/acf-json';
  }

  return $paths;
}

add_filter('acf/settings/load_json', 'mthemes_layout_elements_acf_load_json');