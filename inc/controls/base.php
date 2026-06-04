<?php
if (!defined('ABSPATH')) {
    exit;
}

abstract class SUNFORM_Base_Control
{
    abstract public function get_control_template($attributes);

    abstract public function get_type();
    public function get_render_attributes($attributes)
    {
        $attribute_string = '';
        $attribute_end = '';
        foreach ($attributes as $key => $value) {
            if (in_array($key, ['required', 'multiple'])) {
                $attribute_end .= ' ' . esc_attr($key);
            } else {
                if (!empty($key) && !empty($value)) {
                    $attribute_string .= esc_attr($key) . '="' . esc_attr($value) . '" ';
                }
            }
        }
        return trim($attribute_string . $attribute_end);
    }
}