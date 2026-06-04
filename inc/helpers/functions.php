<?php
if (!defined('ABSPATH')) exit;

require_once __DIR__ . '/../lib/twig/vendor/autoload.php';
use Twig\Environment;
use Twig\Loader\ArrayLoader;

class SUNFORM_Helper
{
    private $twig;

    public function __construct()
    {
        $this->twig = new Environment(new ArrayLoader());
    }

    public function wpformbuilder_render_template($html, $data = [])
    {
        try {
            if (!$this->twig) {
                throw new \Exception("Twig is not initialized.");
            }

            $template = $this->twig->createTemplate($html);
            return $template->render($data);
        } catch (\Exception $e) {
            return 'Error rendering template: ' . $e->getMessage();
        }
    }

    public function wpformbuilder_get_form_settings($post_id, $form_ID)
    {
        $post = get_post($post_id);

        if (!$post) {
            return null;
        }

        $blocks = parse_blocks($post->post_content);

        foreach ($blocks as $block) {
            if ($block['blockName'] === 'sun-formbuilder/form' && $block['attrs']['form']['id'] === $form_ID) {
                $block_attributes = $block['attrs'] ?? [];
                unset($block_attributes['state'], $block_attributes['css']);
                return $block_attributes;
            }
        }
        return null;
    }

    public function wpformbuilder_get_form_data($settings, $subbmit_data)
    {
        $data = [];
        $fields = !empty($settings['fields']) ? $settings['fields'] : [];
        foreach ($fields as $key => $item) {
            if (isset($subbmit_data[$item['name']])) {
                $data[$item['name']] = [
                    'value' => $subbmit_data[$item['name']],
                    'label' => $item['label'],
                    'type' => $item['type']
                ];
            }
        }
        return $data;
    }

    public function wpformbuilder_get_content_email_template($id)
    {
        $email_content = get_post_meta($id, '_sun_email_template', true);
        return $email_content;
    }

    public function wpformbuilder_get_value_repeater_api($data, $field_name, $fields_map)
    {
        if ($field_name == 'custom_value') {
            $value = !empty($fields_map['custom_value']) ? $fields_map['custom_value'] : '';
        } else {
            $value = !empty($data[$field_name]) ? $data[$field_name]['value'] : '';
        }
        return $value;
    }

    public function wpformbuilder_get_value_repeater_mailchimp_address($data, $address)
    {
        $address_value = [];
        foreach ($address as $key => $name) {
            $address_value[$key] = $data[$name]['value'] ?? '';
        }
        return $address_value;
    }

    public function wpformbuilder_mailchimp_curl_post_member($url, $api_key, $data)
    {
        $args = [
            'headers' => [
                'Authorization' => 'Basic ' . base64_encode("user:$api_key"),
                'Content-Type' => 'application/json'
            ],
            'body' => json_encode($data)
        ];
        $result = wp_remote_post($url, $args);
        return json_decode(wp_remote_retrieve_body($result));
    }

    public function wpformbuilder_mailchimp_curl_put_member($url, $api_key, $data)
    {
        $args = [
            'method' => 'PUT',
            'headers' => [
                'Authorization' => 'Basic ' . base64_encode('user:' . $api_key),
                'Content-Type' => 'application/json'
            ],
            'body' => json_encode($data)
        ];
        $result = wp_remote_request($url, $args);
        return json_decode(wp_remote_retrieve_body($result));
    }

    public function array_value_exists($array, $keys, $default = null) {
    foreach ($keys as $key) {
        if (!is_array($array) || !array_key_exists($key, $array)) {
            return $default;
        }
        $array = $array[$key];
    }
    return $array;
}

    public function wpformbuilder_get_metadata_data($meta_data, $page_url)
    {
        $meta_data_string = '';
        foreach ($meta_data as $meta_item) {
            switch ($meta_item) {
                case 'Date':
                    $meta_data_string .= 'Date: ' . date_i18n(get_option('date_format')) . '<br>';
                    break;
                case 'Time':
                    $meta_data_string .= 'Time: ' . date_i18n(get_option('time_format')) . '<br>';
                    break;
                case 'User Agent':
                    $user_agent = isset($_SERVER['HTTP_USER_AGENT']) ? sanitize_text_field(wp_unslash($_SERVER['HTTP_USER_AGENT'])) : '';
                    $meta_data_string .= "User Agent: " . $user_agent . '<br>';
                    break;
                case 'Remote IP':
                    $meta_data_string .=  "Remote IP: " . $this->wpformbuilder_get_remote_ip() . '<br>';
                    break;
                case 'Page URL':
                    $meta_data_string .= "Page URL: " . $page_url . '<br>';
                    break;
            }
        }
        return !empty($meta_data_string) ? "<br>-------<br>$meta_data_string" : '';
    }
    public function wpformbuilder_get_remote_ip()
    {
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            $ip = sanitize_text_field(wp_unslash($_SERVER['HTTP_CLIENT_IP']));
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $forwarded = sanitize_text_field(wp_unslash($_SERVER['HTTP_X_FORWARDED_FOR']));
            $ip = trim(explode(',', $forwarded)[0]);
        } elseif (!empty($_SERVER['REMOTE_ADDR'])) {
            $ip = sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR']));
        } else {
            $ip = '';
        }
        return filter_var($ip, FILTER_VALIDATE_IP) ? $ip : '';
    }
}