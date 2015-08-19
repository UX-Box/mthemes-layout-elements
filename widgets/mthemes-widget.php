<?php 

class Mthemes_Widget extends WP_Widget {

  public function __construct($id, $name, $args) {
    parent::__construct($id, $name, $args);
  }

  public function widget($args, $instance) {}

  public function form($instance) {
    $layout_element_id = ! empty($instance['layout_element_id']) ? $instance['layout_element_id'] : uniqid();
    $layout_element_type = $this->type;
    $layout_element_data = 'layout-element-' . $layout_element_id . '-' . $layout_element_type;
    ?>
    <input id="<?php echo $this->get_field_id('layout_element_data'); ?>" class="hidden mthemes-element-data" name="<?php echo $this->get_field_name('layout_element_data'); ?>" type="text" value="<?php echo esc_attr( $layout_element_data ); ?>">
    <input id="<?php echo $this->get_field_id('layout_element_id'); ?>" class="hidden mthemes-element-id" name="<?php echo $this->get_field_name('layout_element_id'); ?>" type="text" value="<?php echo esc_attr( $layout_element_id ); ?>">
    <input id="<?php echo $this->get_field_id('layout_element_type'); ?>" class="hidden mthemes-element-type" name="<?php echo $this->get_field_name('layout_element_type'); ?>" type="text" value="<?php echo esc_attr( $layout_element_type ); ?>">
    <span class="mthemes-layout-element hide"><?php echo $layout_element_id ?></span><!-- placeholder element -->
    <script>mthemesLayoutElementsEvents.trigger('panel.available', '<?php echo $layout_element_id ?>')</script>
    <?php
  }

  public function update($new_instance, $old_instance) {
    return $new_instance;
  }

  protected function getData ($instance) {
    if (function_exists('get_field')) {
      $data         = get_field('layout_elements');
      $data_element = null;

      foreach ($data as $layout_element_data) {
        if(is_array($layout_element_data) and !empty($layout_element_data['layout_element_id']) and $layout_element_data['layout_element_id'] == $instance['layout_element_id']) {
          $data_element = $layout_element_data;
        }
      }

      return $data_element;
    }
  }
}