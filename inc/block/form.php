<?php
if (!defined('ABSPATH')) {
    exit;
}

add_action('init', 'sunform_register_dynamic_form_block');

$sunform_controls = glob(__DIR__ . '/../controls/*.php');
foreach ($sunform_controls as $sunform_control) {
    require_once $sunform_control;
}
function sunform_register_dynamic_form_block()
{
    register_block_type('sunformbuilder/form', [
        'render_callback' => 'sunform_render_form_block',
    ]);
    wp_enqueue_style('sunformbuilder-style');
}
function sunform_render_form_block($attributes)
{
    $submit_button_size = $attributes['button']['size'] ?? 'sm';
    $submit_button_text = $attributes['button']['name'] ?? 'Submit';
    $form_id            = $attributes['form']['id'] ?? '';
    $form_post_form     = $attributes['form']['post_form'] ?? '';
    $form_input_size    = $attributes['form']['input_size'] ?? '';
    $form_data          = !empty($attributes['fields']) ? $attributes['fields'] : [];
    $html               = '';

    if (!empty($form_data)) {
        $html .= '<div class="wpformbuilder-form wpformbuilder-form-' . esc_attr($form_id) . '">';
        $html .= '<form class="wpformbuilder-box-form" data-form-id="' . esc_attr($form_id) . '" data-post-form="' . esc_attr($form_post_form) . '"><div class="wpformbuilder-form__inner">';
        $html .= '<input type="hidden" name="page_url" value="' . esc_url(get_permalink()) . '">';

        foreach ($form_data as $key => $item) {
            $type       = !empty($item['type']) ? $item['type'] : '';
            $class_name = 'SUNFORM_' . ucfirst($type) . '_Control';
            $item['input_size'] = $form_input_size;
            if (class_exists($class_name)) {
                $html .= (new $class_name())->get_control_template($item);
            }
        }

        $html .= '</div><div class="wpformbuilder-form__button">';
        $html .= '<button type="submit" class="wpformbuilder-form__button--submit wpformbuilder-button-submit-' . esc_attr($submit_button_size) . '"><span class="wpformbuilder-form__button--submit__content">';

        $icon_type = $attributes['button']['icon']['type'] ?? '';
        $icon_name = $attributes['button']['icon']['name'] ?? '';
        $icon_url  = $attributes['button']['icon']['url']  ?? '';

        if ($icon_type !== '' && ($icon_name !== '' || $icon_url !== '')) {
            $icon_spacing = $attributes['button']['icon']['spacing']  ?? '10px';
            $ion_position = $attributes['button']['icon']['position'] ?? 'right';
            $icon_group   = $attributes['button']['icon']['group']    ?? '';

            if ($ion_position === 'left') {
                if ($icon_type === 'icon_lib') {
                    $html .= '<span class="wpformbuilder-submit-button-icon" style="margin-right: ' . esc_attr($icon_spacing) . '"><i class="fa-' . esc_attr($icon_group) . ' fa-' . esc_attr($icon_name) . '"></i></span>';
                }
                if ($icon_type === 'upload') {
                    $html .= '<span class="wpformbuilder-submit-button-icon" style="margin-right: ' . esc_attr($icon_spacing) . '"><img src="' . esc_url($icon_url) . '" alt="" /></span>';
                }
                $html .= '<span class="wpformbuilder-submit-button-text">' . esc_html($submit_button_text) . '</span>';
            }

            if ($ion_position === 'right') {
                $html .= '<span class="wpformbuilder-submit-button-text">' . esc_html($submit_button_text) . '</span>';
                if ($icon_type === 'icon_lib') {
                    $html .= '<span class="wpformbuilder-submit-button-icon" style="margin-left: ' . esc_attr($icon_spacing) . '"><i class="fa-' . esc_attr($icon_group) . ' fa-' . esc_attr($icon_name) . '"></i></span>';
                }
                if ($icon_type === 'upload') {
                    $html .= '<span class="wpformbuilder-submit-button-icon" style="margin-left: ' . esc_attr($icon_spacing) . '"><img src="' . esc_url($icon_url) . '" alt="" /></span>';
                }
            }
        } else {
            $html .= '<span class="wpformbuilder-submit-button-text">' . esc_html($submit_button_text) . '</span>';
        }

        $html .= '</span></button></div>';
        $html .= '<div class="wpformbuilder-message">
            <div class="wpformbuilder-message__submit" style="display: none;"></div>
        </div></form><div class="wpformbuilder-overlay" hidden></div></div>';
    }
    return $html;
}
