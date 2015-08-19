<?php 
if(!function_exists('mthemes_tag_attributes')) {
  function mthemes_tag_attributes( $args = array() ){
      if(!is_array($args)){
          return;
      }

      $attributes     = array();
      $attributes_str = '';

      foreach($args as $key => $value){
          if(is_array($value) and count($value) > 0){
              $value = implode(' ', $value);
          }

          if(is_string($value) and $value != ''){
              $attributes[$key] = $value;
          }
      }

      foreach($attributes as $key => $value){
          $attributes_str .= ' ' . esc_attr($key) . '="'. esc_attr($value) .'"';
      }

      return $attributes_str;
  }
}