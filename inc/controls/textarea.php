<?php
if (!defined('ABSPATH')) {
    exit;
}
class SUNFORM_Textarea_Control extends SUNFORM_Base_Control
{
    public function get_type()
    {
        return 'textarea';
    }
    public function get_control_template($attributes)
    {
        $label = !empty($attributes['label']) ? $attributes['label'] : '';
        $default_value = empty($attributes['default_value']) ? $attributes['default_value'] : '';
        $textarea_attributes = [
            'name' => !empty($attributes['name']) ? $attributes['name'] : '',
            'id' => !empty($attributes['id']) ? $attributes['id'] : '',
            'class' => 'wpformbuilder-form-control__field ' . $attributes['input_size'] . '',
            'minlength' => !empty($attributes['min_length']) ? $attributes['min_length'] : '',
            'maxlength' => !empty($attributes['max_length']) ? $attributes['max_length'] : '',
            'autocomplete' => !empty($attributes['autocomplete']) ? $attributes['autocomplete'] : '',
            'rows' => !empty($attributes['rows']) ? $attributes['rows'] : '4',
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

        return "
            <div " . $this->get_render_attributes($group_attributes) . ">
                <label " . $this->get_render_attributes($label_attributes) . ">$label</label>
                <div class='wpformbuilder-form-control textarea'>
                    <textarea " . $this->get_render_attributes($textarea_attributes) . ">" . $default_value . "</textarea>
                </div>
            </div>
        ";
    }

}