<?php
if (!defined('ABSPATH')) {
    exit;
}
class SUNFORM_Radio_Control extends SUNFORM_Base_Control
{
    public function get_type()
    {
        return 'radio';
    }
    public function get_control_template($attributes)
    {
        $label = !empty($attributes['label']) ? $attributes['label'] : '';
        $radios = $attributes['options'] ?? [];
        $default_value = !empty($attributes['default_value']) ? $attributes['default_value'] : '';
        $radio_attributes = [
            'type' => 'radio',
            'name' => !empty($attributes['name']) ? $attributes['name'] : '',
            'id' => !empty($attributes['id']) ? $attributes['id'] : '',
            'class' => 'wpformbuilder-form-control__field ' . $attributes['input_size'] . '',
            'required' => !empty($attributes['required']) ? 'required' : ''
        ];
        $label_attributes = [
            'class' => 'wpformbuilder-form-group__label'
        ];

        $group_attributes = [
            'class' => 'wpformbuilder-form-group ' . $attributes['id'],
            'data-field-label' => $label
        ];

        return "
            <div " . $this->get_render_attributes($group_attributes) . ">
                <label " . $this->get_render_attributes($label_attributes) . ">" . esc_html($label) . "</label>
                <div class='wpformbuilder-form-control radio'>
                    " . $this->render_radio_items($radios, $default_value, $radio_attributes) . "
                </div>
            </div>
        ";
    }

    public function render_radio_items($radios, $default_value, $attributes)
    {
        $html = '';
        $selected = explode(',', str_replace(' ', '', $default_value));
        $i = 1;
        foreach ($radios as $key => $value) {
            $radio_item_attribute = $attributes;
            $radio_item_attribute['id'] = $attributes['id'] . $i;
            $radio_item_attribute['value'] = $value;

            if($i !== 1 && isset($radio_item_attribute['required'])){
                unset($radio_item_attribute['required']);
            }
            if (in_array($value, $selected)) {
                $html .= '
                    <div class="wpformbuilder-radio-item">
                        <div class="wpformbuilder-radio-item__input">
                            <input ' . $this->get_render_attributes($radio_item_attribute) . ' checked>
                        </div>
                        <label for="' . esc_attr($radio_item_attribute['id']) . '">' . esc_html($key) . '</label>
                    </div>
                    ';
            } else {
                $html .= '
                    <div class="wpformbuilder-radio-item">
                    <div class="wpformbuilder-radio-item__input">
                        <input ' . $this->get_render_attributes($radio_item_attribute) . '>
                    </div>
                        <label for="' . esc_attr($radio_item_attribute['id']) . '">' . esc_html($key) . '</label>
                    </div>
                ';
            }
            $i++;
        }
        return $html;
    }
}