<?php

if ( ! defined( 'ABSPATH' ) ) exit;

class SUNFORM_Ajax_Plugin_Control
{
    public function __construct()
    {
        add_action('wp_ajax_sunform_save_options', [$this, 'sunform_save_options']);
    }

    /**
     * Returns the whitelist of option names that can be saved through this
     * AJAX endpoint. Restricting to a known list prevents an authenticated
     * user from overwriting arbitrary WordPress options (e.g. default_role,
     * users_can_register, siteurl) and escalating privileges.
     */
    protected function get_allowed_options()
    {
        $defaults = [
            'sun_mailchimp_api_key',
            'wpformbuilder_stripe_publishable_key',
            'wpformbuilder_stripe_secret_key',
            'sun_debug_mode',
        ];

        return apply_filters('sunform_ajax_save_options_whitelist', $defaults);
    }

    public function sunform_save_options()
    {
        if (!isset($_POST['nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['nonce'])), 'sun_post_nonce')) {
            wp_send_json_error(['message' => 'Nonce verification failed.'], 403);
        }

        if (!current_user_can('manage_options')) {
            wp_send_json_error(['message' => 'You are not allowed to update plugin options.'], 403);
        }

        $data = isset($_POST['data']) && is_array($_POST['data'])
            ? map_deep(wp_unslash($_POST['data']), 'sanitize_text_field')
            : [];

        $name  = isset($data['name']) ? $data['name'] : '';
        $value = isset($data['value']) ? $data['value'] : '';

        $allowed = $this->get_allowed_options();
        if ('' === $name || !in_array($name, $allowed, true)) {
            wp_send_json_error(['message' => 'Invalid option name.'], 400);
        }

        update_option($name, $value);
        wp_send_json_success(['message' => 'Options saved successfully.']);
    }

}
new SUNFORM_Ajax_Plugin_Control();
