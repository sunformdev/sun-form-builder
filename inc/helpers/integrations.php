<?php
if ( ! defined( 'ABSPATH' ) ) exit;

class SUNFORM_Integration_Manager
{
    public function __construct()
    {
        add_action('rest_api_init', function () {
            register_rest_route('sunform/v1', '/integrations', [
                'methods' => 'POST',
                'callback' => [$this, 'wpformbuilder_integrations_request'],
                'permission_callback' => [$this, 'wpformbuilder_integrations_permission'],
            ]);
        });
    }

    public function wpformbuilder_integrations_permission(WP_REST_Request $request)
    {
        if (!current_user_can('manage_options')) {
            return new WP_Error(
                'rest_forbidden',
                __('You are not allowed to access this endpoint.', 'sunformbuilder'),
                ['status' => rest_authorization_required_code()]
            );
        }
        return true;
    }
    public function wpformbuilder_integrations_request(WP_REST_Request $request)
    {
        $service = $request->get_param('service');
        $settings = $request->get_param('settings');
        $data = [];
        switch ($service) {
            case 'mailchimp':
                $data = $this->wpformbuilder_mailchimp_get_data($settings);
                break;
            default:
                return new WP_Error('invalid_service', 'Service not supported', ['status' => 400]);
        }
        return new WP_REST_Response([
            'success' => true,
            'data' => $data,
        ], 200);
    }
    public function wpformbuilder_mailchimp_get_data($settings)
    {
        $api_key_type = isset($settings['mailchimp']['type']) ? $settings['mailchimp']['type'] : false;
        $api_key = $api_key_type === 'custom' ? $settings['mailchimp']['api_key_cusom'] : get_option('sun_mailchimp_api_key');
        if (!empty($api_key)) {
            $url_get_list = 'https://' . substr($api_key, strpos($api_key, '-') + 1) . '.api.mailchimp.com/3.0/lists/';
            $list_id_selected = isset($settings['mailchimp']['list_id_selected']) ? $settings['mailchimp']['list_id_selected'] : '';
            //Get List
            $lists = $this->wpformbuilder_mailchimp_get_connect($url_get_list, 'GET', $api_key, ['fields' => 'lists', 'count' => 100])->lists ?? [];
            $list_ids = [['label' => '-- Select List --', 'value' => '', 'disabled' => true]];
            foreach ($lists as $item) {
                array_push($list_ids, ['label' => $item->name, 'value' => $item->id]);
            }
            if (!empty($list_id_selected)) {
                $groups = $this->wpformbuilder_mailchimp_get_groups($api_key, $list_id_selected);
                $fields = $this->wpformbuilder_mailchimp_get_fields($api_key, $list_id_selected);
            }

            return [
                "fields" => $fields ?? [],
                "groups" => $groups ?? [],
                "list_ids" => $list_ids ?? []
            ];
        }else{
            return false;
        }
    }
    public function wpformbuilder_mailchimp_get_groups($api_key, $list_id)
    {
        $groups = [];
        $url_get_group = "https://" . substr($api_key, strpos($api_key, '-') + 1) . ".api.mailchimp.com/3.0/lists/$list_id/interest-categories/";
        $interest_categories = $this->wpformbuilder_mailchimp_get_connect($url_get_group, 'GET', $api_key, ['count' => 100])->categories;
        foreach ($interest_categories as $cat) {
            $categorys = $this->wpformbuilder_mailchimp_get_groups_category($api_key, $list_id, $cat->id, $cat->title);
            foreach ($categorys as $key => $val) {
                $groups[$key] = $val;
            }
        }
        return $groups;
    }

    public function wpformbuilder_mailchimp_get_groups_category($api_key, $list_id, $group_id, $title)
    {
        $data = [
            'count' => 100,
        ];
        $category = [];
        $url_get_cat = "https://" . substr($api_key, strpos($api_key, '-') + 1) . ".api.mailchimp.com/3.0/lists/$list_id/interest-categories/$group_id/interests/";
        $result = $this->wpformbuilder_mailchimp_get_connect($url_get_cat, 'GET', $api_key, $data);
        foreach ($result->interests as $item) {
            $category["$title-{$item->name}"] = $item->id;
        }
        return $category;
    }

    public function wpformbuilder_mailchimp_get_fields($api_key, $list_id)
    {
        $fields = [['label' => 'Tags', 'value' => 'tags']];
        $url_get_fields = "https://" . substr($api_key, strpos($api_key, '-') + 1) . ".api.mailchimp.com/3.0/lists/$list_id/merge-fields/";
        $merge_fields = $this->wpformbuilder_mailchimp_get_connect($url_get_fields, 'GET', $api_key, ['count' => 100])->merge_fields ?? [];
        foreach ($merge_fields as $key => $item) {
            array_push($fields, ['label' => $item->name, 'value' => $item->tag]);
        }
        return $fields;
    }
    public function wpformbuilder_mailchimp_get_connect($url, $request_type, $api_key, $data = [])
    {
        $args = [
            'method'  => $request_type,
            'timeout' => 15,
            'headers' => [
                'Authorization' => 'Basic ' . base64_encode('user:' . $api_key),
                'Content-Type'  => 'application/json',
            ],
        ];

        if ('GET' !== $request_type) {
            $args['body'] = wp_json_encode($data);
        }

        $response = wp_remote_request($url, $args);
        return json_decode(wp_remote_retrieve_body($response));
    }
}
new SUNFORM_Integration_Manager();