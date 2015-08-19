<?php 
class Mthemes_Image_Widget  extends Mthemes_Widget {
  public $type = "image";

  public function __construct() {
    parent::__construct(
      'mthemes-image-widget', 
      __('Image', 'mthemes'), 
      array(
        'description' => __('Displays a simple image with responsive and loading options.', 'mthemes')
      )
    );
  }

  public function widget( $args, $instance ) {
    echo $args['before_widget'];

    $data         = $this->getData($instance);
    $attr         = array(
      'src'    => null,
      'width'  => null,
      'height' => null,
      'alt'    => $data['image']['alt']
    );

    $image_size   = $data['image_size'];

    switch ($image_size) {
      case 'original':
        $attr['src']    = $data['image']['url'];
        $attr['width']  = $data['image']['width'];
        $attr['height'] = $data['image']['height'];
        break;

      default:
        $attr['src']    = $data['image']['sizes'][$image_size];
        $attr['width']  = $data['image']['sizes'][$image_size.'-width'];
        $attr['height'] = $data['image']['sizes'][$image_size.'-height'];
        break;
    }

    ?>
    <img<?php echo mthemes_tag_attributes($attr) ?>>
    <?php
    echo $args['after_widget'];
  }
}

$mthemes_layout_elements_widgets[] = 'Mthemes_Image_Widget';