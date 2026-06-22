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
            if ($block['blockName'] === 'sunformbuilder/form' && $block['attrs']['form']['id'] === $form_ID) {
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
            $name = isset($item['name']) ? (string) $item['name'] : '';
            if ($name === '' || !isset($subbmit_data[$name])) {
                continue;
            }
            $type = isset($item['type']) ? (string) $item['type'] : 'text';
            $raw_value = wp_unslash($subbmit_data[$name]); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- sanitize ngay bên dưới qua wpformbuilder_sanitize_field_value()
            $data[$name] = [
                'value' => $this->wpformbuilder_sanitize_field_value($raw_value, $type),
                'label' => isset($item['label']) ? sanitize_text_field((string) $item['label']) : '',
                'type'  => sanitize_key($type),
            ];
        }
        return $data;
    }

    /**
     * Sanitize giá trị của một field theo đúng kiểu khai báo trong form settings.
     * Tự xử lý đệ quy với mảng (vd: checkbox nhiều giá trị).
     *
     * @param mixed  $value Giá trị đã được wp_unslash().
     * @param string $type  Kiểu field: text, email, url, textarea, number, tel, hidden, password, select, radio, checkbox.
     * @return mixed
     */
    public function wpformbuilder_sanitize_field_value($value, $type = 'text')
    {
        if (is_array($value)) {
            $sanitized = [];
            foreach ($value as $k => $v) {
                $sanitized[is_string($k) ? sanitize_text_field($k) : $k] = $this->wpformbuilder_sanitize_field_value($v, $type);
            }
            return $sanitized;
        }

        if (!is_scalar($value)) {
            return '';
        }

        $value = (string) $value;

        switch ($type) {
            case 'email':
                return sanitize_email($value);
            case 'url':
                return esc_url_raw($value);
            case 'textarea':
                return sanitize_textarea_field($value);
            case 'number':
                return is_numeric($value) ? $value + 0 : sanitize_text_field($value);
            case 'tel':
            case 'text':
            case 'hidden':
            case 'password':
            case 'select':
            case 'radio':
            case 'checkbox':
            default:
                return sanitize_text_field($value);
        }
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