<?php

if ( ! defined( 'ABSPATH' ) ) exit;

class SUNFORM_Ajax_Submit_Form extends SUNFORM_Helper
{
    public function __construct()
    {
        parent::__construct();
        add_action('wp_ajax_sun_submit_from', [$this, 'sfbuilder_submit_from']);
        add_action('wp_ajax_nopriv_sun_submit_from', [$this, 'sfbuilder_submit_from']);
    }

    public function sfbuilder_submit_from()
    {
        if (isset($_POST['nonce']) && wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['nonce'])), 'sun_post_nonce')) {
            $form_ID = !empty($_POST['formID']) ? sanitize_text_field(wp_unslash($_POST['formID'])) : '';
            $post_form_id = !empty($_POST['post_form_id']) ? sanitize_text_field(wp_unslash($_POST['post_form_id'])) : '';
            $page_url = !empty($_POST['page_url']) ? esc_url_raw(wp_unslash($_POST['page_url'])) : '';

            $settings = $this->wpformbuilder_get_form_settings($post_form_id, $form_ID);
            $submit_data = $this->wpformbuilder_get_form_data($settings, $_POST); // phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized,WordPress.Security.ValidatedSanitizedInput.MissingUnslash -- Nonce đã verify ở trên; dữ liệu được unslash + sanitize trong wpformbuilder_get_form_data().
            $action_submit = $settings['action_submit'] ?? ['Email'];

            foreach ($action_submit as $action) {
                switch ($action) {
                    case 'Email':
                        $this->wpformbuilder_send_email($submit_data, $settings, $page_url);
                        break;
                    case 'Mailchimp':
                        $this->wpformbuilder_action_mailchimp_submit($submit_data, $settings);
                        break;
                }
            }
            //echo "<pre>"; var_dump($settings); echo "</pre>"; die('456');
            $ajax_form_status = [
                'status' => 'success',
                'msg' => $this->array_value_exists($settings, ['additional_options', 'messages', 'success'], 'Your submission was successful.')
            ];
            echo json_encode($ajax_form_status);
            wp_die();

        } else {
            echo "Nonce verification failed.";
        }
    }

    public function wpformbuilder_send_email($submit_data, $settings, $page_url)
    {
        $email_settings = $settings['action_submit_settings']['email'] ?? [];
        $email_template_id = $email_settings['template'] ?? get_post_meta(254896, '_sun_id_email_template_default', true);
        //Metadata
        $meta_data = $email_settings['meta_data'] ?? [];
        $meta_data_string = $this->wpformbuilder_get_metadata_data($meta_data, $page_url);

        $email_data = [];
        foreach ($submit_data as $key => $item) {
            if (array_key_exists('value', $item)) {
                $email_data[$key] = $item['value'];
            }
        }
        $email_data['meta_data'] = $meta_data_string;
        $email_content_html = $this->wpformbuilder_get_content_email_template($email_template_id);
        $email_template_data = [
            'submit_id' => '111',
            'meta_data' => $meta_data_string,
            'data' => $submit_data
        ];
        $email_template_data = array_merge($email_data, $email_template_data);
        $email_content = $this->wpformbuilder_render_template($email_content_html, $email_template_data);

        $email_to = explode(", ", $email_settings['to'] ?? get_option('admin_email'));
        $email_subject = $email_settings['subject'] ?? 'New message from ' . get_bloginfo('name');
        $email_from = $email_settings['from'] ?? str_ireplace('www.', '', wp_parse_url(home_url(), PHP_URL_HOST));
        $email_from_name = $email_settings['from_name'] ?? get_bloginfo('name');
        $email_reply_to = $email_settings['from_name'] ?? $email_from;

        if ($email_from) {
            $headers[] = "From: $email_from_name";
            $headers[] = "Reply-To: $email_reply_to";
        }
        if (!empty($email_settings['cc'])) {
            $headers[] = 'Cc: ' . $email_settings['cc'];
        }
        if (!empty($email_settings['bcc'])) {
            $headers[] = 'Bcc: ' . $email_settings['bcc'];
        }
        $headers[] = 'Content-Type: text/html; charset=UTF-8';
        $send_email = wp_mail($email_to, $email_subject, $email_content, $headers);
        if (!$send_email) {
            $email_status = [
                'status' => 'error',
                'msg' => $this->array_value_exists($settings, ['additional_options', 'messages', 'error'], 'Your submission failed because of an error.')
            ];
            $this->wpformbuilder_send_response_submit($email_status, 'Please check your email configuration.');
        }
    }

    public function wpformbuilder_action_mailchimp_submit($submit_data, $settings)
    {
        $mailchimp_acceptance = true;

        if ($mailchimp_acceptance) {
            $data_mailchimp = [];
            $mailchimp_settings = $settings['action_submit_settings']['mailchimp'] ?? [];
            $mailchimp_api_type = $mailchimp_settings['type'] ?? 'default';
            $mailchimp_api_key = $mailchimp_api_type ? get_option('sun_mailchimp_api_key') : $mailchimp_settings['api_key_cusom'];
            $mailchimp_list_id = $mailchimp_settings['list_id_selected'] ?? '';
            $mailchimp_groups = $mailchimp_settings['groups_id_selected'] ?? [];
            $mailchimp_fields_map = $mailchimp_settings['mappings'] ?? [];

            if (!empty($mailchimp_api_key) && !empty($mailchimp_list_id)) {
                if (!empty($mailchimp_groups)) {
                    foreach ($mailchimp_groups as $id) {
                        $data_mailchimp['interests'][$id] = true;
                    }
                }
                foreach ($mailchimp_fields_map as $field) {
                    switch ($field['tag_name']) {
                        case 'email_address':
                            $data_mailchimp[$field['tag_name']] = $this->wpformbuilder_get_value_repeater_api($submit_data, $field['field_name'], $field);
                            break;
                        case 'tags':
                            $tags = $this->wpformbuilder_get_value_repeater_api($submit_data, $field['field_name'], $field);
                            $data_mailchimp['tags'] = explode(',', $tags);
                            break;
                        case 'ADDRESS':
                            $mailchimp_address_fields = $field['address'] ?? [];
                            $data_mailchimp['merge_fields']['ADDRESS'] = $this->wpformbuilder_get_value_repeater_mailchimp_address($submit_data, $mailchimp_address_fields);
                            break;
                        case 'status':
                            $data_mailchimp['status'] = $mailchimp_settings['send_confirm_email'] ? 'pending' : $field['field_name'];
                        default:
                            $data_mailchimp['merge_fields'][$field['tag_name']] = $this->wpformbuilder_get_value_repeater_api($submit_data, $field['field_name'], $field);
                            break;
                    }
                }
                if ($mailchimp_settings['update_contact']) {
                    $member_id = md5(strtolower($data_mailchimp['email_address']));
                    $mailchimp_url = 'https://' . substr($mailchimp_api_key, strpos($mailchimp_api_key, '-') + 1) . '.api.mailchimp.com/3.0/lists/' . $mailchimp_list_id . '/members/' . $member_id . '';
                    $mailchimp_result = $this->wpformbuilder_mailchimp_curl_put_member($mailchimp_url, $mailchimp_api_key, $data_mailchimp);
                    if ((!empty($mailchimp_result->status) && $mailchimp_result->status != 'subscribed')) {
                        $mailchimp_status = [
                            'status' => 'error',
                            'msg' => $this->array_value_exists($settings, ['additional_options', 'messages', 'error'], 'Your submission failed because of an error.')
                        ];
                        $this->wpformbuilder_send_response_submit($mailchimp_status, $mailchimp_result);
                    }
                } else {
                    $mailchimp_url = 'https://' . substr($mailchimp_api_key, strpos($mailchimp_api_key, '-') + 1) . '.api.mailchimp.com/3.0/lists/' . $mailchimp_list_id . '/members/';
                    $mailchimp_result = $this->wpformbuilder_mailchimp_curl_post_member($mailchimp_url, $mailchimp_api_key, $data_mailchimp);
                    if (!empty($mailchimp_result->status) && $mailchimp_result->status != 'subscribed') {
                        $mailchimp_status = (!empty($mailchimp_result->title) && $mailchimp_result->title == 'Member Exists') ? [
                            'status' => 'error',
                            'msg' => $settings['custom_messenger_subscribers_exists']
                        ] : [
                            'status' => 'error',
                            'msg' => $this->array_value_exists($settings, ['additional_options', 'messages', 'error'], 'Your submission failed because of an error.')
                        ];
                        $this->wpformbuilder_send_response_submit($mailchimp_status, $mailchimp_result);
                    }
                }
            }
        }
    }

    public function wpformbuilder_send_response_submit(array $status, $response = false)
    {
        $debug_mode = get_option('sun_debug_mode');
        if ($status['status'] == 'error') {
            switch ($debug_mode) {
                case '1':
                    echo wp_json_encode($response);
                    break;
                default:
                    echo wp_json_encode($status);
                    break;
            }
            wp_die();
        }
    }

}
new SUNFORM_Ajax_Submit_Form(); // Kiểm tra empty field trong email


