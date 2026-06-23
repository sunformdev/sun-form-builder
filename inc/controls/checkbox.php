<?php
if (!defined('ABSPATH')) {
    exit;
}
class SUNFORM_Checkbox_Control extends SUNFORM_Base_Control
{
    public function get_type()
    {
        return 'checkbox';
    }
    public function get_control_template($attributes)
    {
        $label         = !empty($attributes['label']) ? $attributes['label'] : '';
        $hide_label    = !empty($attributes['hide_label']);
        $checkboxs     = $attributes['options'] ?? [];
        $default_value = !empty($attributes['default_value']) ? $attributes['default_value'] : '';

        $checkbox_attributes = [
            'type' => 'checkbox',
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

        $label_html = $hide_label
            ? ''
            : "<label " . $this->get_render_attributes($label_attributes) . ">" . esc_html($label) . "</label>";

        return "
            <div " . $this->get_render_attributes($group_attributes) . ">
                " . $label_html . "
                <div class='wpformbuilder-form-control checkbox'>
                    " . $this->render_chekbox_items($checkboxs, $default_value, $checkbox_attributes) . "
                </div>
            </div>
        ";
    }

    public function render_chekbox_items($checkboxs, $default_value, $attributes)
    {
        $html = '';
        $selected = explode(',', str_replace(' ', '', $default_value));
        $i = 1;
        foreach ($checkboxs as $key => $value) {
            $checkbox_item_attribute = $attributes;
            $checkbox_item_attribute['id'] = $attributes['id'] . $i;
            $checkbox_item_attribute['value'] = $value;
            if($i !== 1 && isset($radio_item_attribute['required'])){
                unset($radio_item_attribute['required']);
            }
            if (in_array($value, $selected)) {
                $html .= '
                    <div class="wpformbuilder-checkbox-item">
                        <div class="wpformbuilder-checkbox-item__input">
                            <input ' . $this->get_render_attributes($checkbox_item_attribute) . ' checked>
                        </div>
                        <label for="' . esc_attr($checkbox_item_attribute['id']) . '">' . esc_html($key) . '</label>
                    </div>
                    ';
            } else {
                $html .= '
                    <div class="wpformbuilder-checkbox-item">
                    <div class="wpformbuilder-checkbox-item__input">
                        <input ' . $this->get_render_attributes($checkbox_item_attribute) . '>
                    </div>
                        <label for="' . esc_attr($checkbox_item_attribute['id']) . '">' . esc_html($key) . '</label>
                    </div>
                ';
            }
            $i++;
        }
        return $html;
    }
}