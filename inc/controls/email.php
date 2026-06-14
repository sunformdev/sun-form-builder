<?php
if (!defined('ABSPATH')) {
    exit;
}
class SUNFORM_Email_Control extends SUNFORM_Base_Control
{
    public function get_type()
    {
        return 'email';
    }
    public function get_control_template($attributes)
    {
        $label = !empty($attributes['label']) ? $attributes['label'] : '';
        $email_attributes = [
            'type' => 'email',
            'name' => !empty($attributes['name']) ? $attributes['name'] : '',
            'value' => !empty($attributes['default_value']) ? $attributes['default_value'] : '',
            'id' => !empty($attributes['id']) ? $attributes['id'] : '',
            'class' => 'wpformbuilder-form-control__field ' . $attributes['input_size'] . '',
            'minlength' => !empty($attributes['min_length']) ? $attributes['min_length'] : '',
            'maxlength' => !empty($attributes['max_length']) ? $attributes['max_length'] : '',
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
        
        
        return "
            <div " . $this->get_render_attributes($group_attributes) . ">
                <label " . $this->get_render_attributes($label_attributes) . ">" . esc_html($label) . "</label>
                <div class='wpformbuilder-form-control email'>
                    <input " . $this->get_render_attributes($email_attributes) . ">
                </div>
            </div>
        ";
    }

}