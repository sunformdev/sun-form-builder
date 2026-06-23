<?php
if (!defined('ABSPATH')) {
    exit;
}
class SUNFORM_Number_Control extends SUNFORM_Base_Control
{
    public function get_type()
    {
        return 'number';
    }
    public function get_control_template($attributes)
    {
        $label      = !empty($attributes['label']) ? $attributes['label'] : '';
        $hide_label = !empty($attributes['hide_label']);

        $number_attributes = [
            'type' => 'number',
            'name' => !empty($attributes['name']) ? $attributes['name'] : '',
            'value' => !empty($attributes['default_value']) ? $attributes['default_value'] : '',
            'id' => !empty($attributes['id']) ? $attributes['id'] : '',
            'class' => 'wpformbuilder-form-control__field ' . $attributes['input_size'] . '',
            'minlength' => !empty($attributes['min_length']) ? $attributes['min_length'] : '',
            'maxlength' => !empty($attributes['max_length']) ? $attributes['max_length'] : '',
            'min' => !empty($attributes['min']) ? $attributes['min'] : '',
            'max' => !empty($attributes['max']) ? $attributes['max'] : '',
            'step' => !empty($attributes['step']) ? $attributes['step'] : '',
            'autocomplete' => !empty($attributes['autocomplete']) ? $attributes['autocomplete'] : '',
            'required' => !empty($attributes['required']) ? 'required' : ''
        ];
        $label_attributes = [
            'for' => !empty($attributes['id']) ? $attributes['id'] : '',
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
                <div class='wpformbuilder-form-control number'>
                    <input " . $this->get_render_attributes($number_attributes) . ">
                </div>
            </div>
        ";
    }

}