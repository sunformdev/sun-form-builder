<?php

/**
 * Plugin Name: Sun Form Builder
 * Description: Powerful Form Builder for WordPress
 * Version:     1.0.0
 * Author:      Sun Form Builder Team
 * License: GPLv2 or later
 * Text Domain: sunformbuilder
 * License URI: https://www.gnu.org/licenses/gpl-3.0.html
 */

if ( ! defined( 'ABSPATH' ) ) exit;

if (class_exists('Sun_Form_Builder_Pro')) {
    return;
}
define('SUN_FORM_BUILDER_VERSION', '1.0.0');

class Sun_Form_Builder
{

    private $sfbuilder_js_data;
    public function __construct()
    {
        $this->sfbuilder_js_data = [
            'postID' => get_the_ID(),
            'ajaxurl' => admin_url('admin-ajax.php'),
            'admin_email' => get_option('admin_email'),
            'blog_name' => get_bloginfo('name'),
            'from_email' => str_ireplace('www.', '', wp_parse_url(home_url(), PHP_URL_HOST)),
        ];

        add_action('init', [$this, 'SUNFORM_load_plugin']);
        $upload = wp_upload_dir();
        $upload_dir = $upload['basedir'];
        $upload_dir = $upload_dir . '/sunformbuilder';

        define('SUN_FORM_BUILDER_CSS_DIR', $upload_dir . '/css');
        define('SUN_FORM_BUILDER_CSS_URL', $upload['baseurl'] . '/sunformbuilder/css');

        add_action('init', [$this, 'SUNFORM_register_post_type']);
        add_action('init', [$this, 'SUNFORM_register_email_template_post_type'], 10);

        add_action('admin_init', [$this, 'SUNFORM_key_settings']);


        //Admin script
        add_action('admin_init', [$this, 'SUNFORM_load_admin_script']);

        //Metabox Email Template
        add_action('add_meta_boxes', [$this, 'SUNFORM_email_template_metabox']);
        add_action('admin_enqueue_scripts', [$this, 'SUNFORM_codemirror_enqueue_scripts']);

        add_filter('block_categories_all', [$this, 'SUNFORM_set_block_categories'], 10, 2);

        //Register js
        add_action('enqueue_block_editor_assets', [$this, 'SUNFORM_block_script_register']);

        //Setting Admin Page
        add_action('admin_init', [$this, 'SUNFORM_insert_email_template']);

        //Save post
        add_action('save_post_sun_email_template', [$this, 'SUNFORM_save_email_template']);

        require_once(__DIR__ . '/inc/helpers/functions.php');
        require_once(__DIR__ . '/inc/helpers/integrations.php');
        require_once(__DIR__ . '/inc/controls/base.php');
        //Blocks
        $blocks = glob(__DIR__ . '/inc/block/*.php');
        foreach ($blocks as $block) {
            require_once $block;
        }
        //Ajax
        $ajax = glob(__DIR__ . '/inc/ajax/*.php');
        foreach ($ajax as $file) {
            require_once $file;
        }

        //SVG Accept
        add_filter('upload_mimes', function ($mimes) {
            $mimes['svg'] = 'image/svg+xml';
            return $mimes;
        });

        add_action('enqueue_block_editor_assets', [$this, 'SUNFORM_gurenberg_editor']);
        add_action('enqueue_block_assets', [$this, 'SUNFORM_gurenberg_editor_and_frontend']); // Kiểm tra tại sao cần có 2 cái ni
        add_action('wp_enqueue_scripts', [$this, 'SUNFORM_block_conditional_assets']);
        add_action('admin_menu', [$this, 'SUNFORM_admin_menu'], 600);

        add_filter('manage_sun_forms_posts_columns', [$this, 'SUNFORM_set_custom_edit_columns']);
        add_action('manage_sun_forms_posts_custom_column', [$this, 'SUNFORM_custom_column'], 10, 2);
        add_shortcode('sun_form', [$this, 'SUNFORM_shortcode']);
    }

    public static function activate()
    {
        $instance = new self();
        $instance->SUNFORM_register_post_type();
        flush_rewrite_rules();
    }

    public function SUNFORM_load_admin_script()
    {
        if ($this->is_sun_settings_page()) {
            add_action('admin_enqueue_scripts', [$this, 'SUNFORM_admin_script']);
        }
    }

    public function SUNFORM_load_plugin()
    {
        $this->sfbuilder_js_data['nonce'] = wp_create_nonce('sun_post_nonce');
        $this->sfbuilder_js_data['email_templates'] = $this->SUNFORM_get_email_template();
        $this->sfbuilder_js_data['email_templates_default'] = get_post_meta(254896, '_sun_id_email_template_default', true);
        $this->sfbuilder_js_data['api']['mailchimp'] = !empty(get_option('sun_mailchimp_api_key')) ? true : false;

        $upload = wp_upload_dir();
        $upload_dir = $upload['basedir'];
        $upload_dir = $upload_dir . '/sunformbuilder';

        global $wp_filesystem;
        if (empty($wp_filesystem)) {
            require_once ABSPATH . 'wp-admin/includes/file.php';
            WP_Filesystem();
        }

        if (!$wp_filesystem->is_dir($upload_dir)) {
            $wp_filesystem->mkdir($upload_dir, 0775);
        } else {
            $wp_filesystem->chmod($upload_dir, 0775);
        }
        if (!$wp_filesystem->is_dir($upload_dir . '/css')) {
            $wp_filesystem->mkdir($upload_dir . '/css', 0775);
        } else {
            $wp_filesystem->chmod($upload_dir . '/css', 0775);
        }
    }

    public function SUNFORM_set_block_categories($categories)
    {
        return array_merge(
            [
                [
                    'slug' => 'sunformbuilder',
                    'title' => __('WP Form Builder', 'sunformbuilder'),
                ],
            ],
            $categories
        );
    }
    public function SUNFORM_block_script_register()
    {
        wp_enqueue_script(
            'sunformbuilder-blocks-js',
            plugins_url('assets/js/minify/form.min.js', __FILE__),
            ['wp-blocks', 'wp-element', 'wp-editor'],
            SUN_FORM_BUILDER_VERSION
        );

        wp_localize_script(
            'sunformbuilder-blocks-js',
            'sfbuilder_js_data',
            $this->sfbuilder_js_data
        );
    }

    public function SUNFORM_gurenberg_editor_and_frontend()
    {
        // phpcs:disable WordPress.Security.NonceVerification.Recommended
        $action               = isset($_GET['action']) ? sanitize_text_field(wp_unslash($_GET['action'])) : '';
        $is_elementor_preview = isset($_GET['elementor-preview']);
        // phpcs:enable WordPress.Security.NonceVerification.Recommended

        if ('elementor' === $action || $is_elementor_preview) {
            return;
        }

        wp_enqueue_style(
            'sunformbuilder-style',
            plugins_url('assets/css/minify/form.min.css', __FILE__),
            [],
            SUN_FORM_BUILDER_VERSION
        );
    }

    public function SUNFORM_shortcode($atts)
    {
        $atts = shortcode_atts([
            'id' => '',
        ], $atts, 'sun_form');

        if (empty($atts['id'])) {
            return 'Please provide a valid ID.';
        }

        $post_form = get_post($atts['id']);
        if (!$post_form || $post_form->post_type !== 'sun_forms') {
            return 'Form not found.';
        }

        // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound
        $content = apply_filters('the_content', $post_form->post_content);

        wp_register_style(
            'sunformbuilder-style',
            plugins_url('assets/css/minify/form.min.css', __FILE__),
            [],
            SUN_FORM_BUILDER_VERSION
        );
        wp_enqueue_style('sunformbuilder-style');
        $handles = ['sunformbuilder-style'];

        $css_file = SUN_FORM_BUILDER_CSS_DIR . '/' . $atts['id'] . '.css';
        if (file_exists($css_file)) {
            $handle_custom = 'sunformbuilder-style-' . $atts['id'];
            wp_register_style(
                $handle_custom,
                SUN_FORM_BUILDER_CSS_URL . '/' . $atts['id'] . '.css',
                [],
                filemtime($css_file)
            );
            wp_enqueue_style($handle_custom);
            $handles[] = $handle_custom;
        }

        ob_start();
        wp_print_styles($handles);
        $printed = ob_get_clean();

        return $printed . $content;
    }


    public function SUNFORM_gurenberg_editor()
    {
        wp_enqueue_style(
            'sunformbuilder-gutenberg-editor',
            plugins_url('assets/css/minify/editor.min.css', __FILE__),
            [],
            SUN_FORM_BUILDER_VERSION
        );
    }

    public function SUNFORM_key_settings()
    {
        register_setting('sun_admin_settings', 'sun_mailchimp_api_key', ['sanitize_callback' => 'sanitize_text_field']);
        register_setting('sun_admin_settings', 'sun_debug_mode', ['sanitize_callback' => 'sanitize_text_field']);
    }


    public function SUNFORM_block_conditional_assets()
    {
        global $post;
        if (!is_admin() && has_block('sunformbuilder/form') ||  !empty($post) && (has_shortcode($post->post_content, 'sun_form'))) {
            $post_content = $post->post_content;
            wp_enqueue_script(
                'sunformbuilder-submit-js',
                plugins_url('assets/js/minify/submit.min.js', __FILE__),
                ['jquery'],
                SUN_FORM_BUILDER_VERSION
            );
            wp_localize_script(
                'sunformbuilder-submit-js',
                'sfbuilder_js_data',
                $this->sfbuilder_js_data
            );

            if (has_shortcode($post_content, 'sun_form')) {
                preg_match_all('/\[sun_form.*?id=["\']?(\d+)["\']?.*?\]/', $post_content, $matches);

                if (!empty($matches[1])) {
                    $shortcode_ids = $matches[1];
                    $id = $shortcode_ids[0];
                }
            }

            if (!is_admin() && has_block('sunformbuilder/form')) {
                $id = $post->ID;
            }

            if (isset($id)) {
                $version = file_exists(SUN_FORM_BUILDER_CSS_DIR . '/' . $id . '.css') ? filemtime(SUN_FORM_BUILDER_CSS_DIR . '/' . $id . '.css') : time();
                wp_enqueue_style(
                    'sunformbuilder-style-' . $id,
                    SUN_FORM_BUILDER_CSS_URL . '/' . $id . '.css',
                    [],
                    $version
                );
            }
        }
    }
    public function SUNFORM_admin_menu()
    {
        add_menu_page(
            'Sun Forms',
            'Sun Forms',
            'manage_options',
            'edit.php?post_type=sun_forms',
            '',
            'dashicons-feedback'
        );
        add_submenu_page('edit.php?post_type=sun_forms', 'All Form', 'All Form', 'manage_options', 'edit.php?post_type=sun_forms');
        add_submenu_page('edit.php?post_type=sun_forms', 'Email Templates', 'Email Templates', 'manage_options', 'edit.php?post_type=sun_email_templates');
        add_submenu_page('edit.php?post_type=sun_forms', 'Settings', 'Settings', 'manage_options', 'sun_settings', [$this, 'get_admin_page']);
    }

    public function get_admin_page()
    {
        require_once(__DIR__ . '/inc/settings/admin-page.php');
    }

    public function SUNFORM_admin_script()
    {
        wp_enqueue_style('sunformbuilder-admin-style', plugin_dir_url(__FILE__) . 'assets/css/minify/admin.min.css');
        wp_enqueue_script('sunformbuilder-admin', plugin_dir_url(__FILE__) . 'assets/js/minify/admin.min.js', ['jquery'], SUN_FORM_BUILDER_VERSION);
        wp_localize_script('sunformbuilder-admin', 'sfbuilder_js_data', $this->sfbuilder_js_data);
    }
    public function SUNFORM_register_post_type()
    {
        register_post_type(
            'sun_forms',
            [
                'labels' => array(
                    'name' => __('All Forms', 'sunformbuilder'),
                    'singular_name' => __('All Forms', 'sunformbuilder'),
                    'add_new_item' => __('Add New Form', 'sunformbuilder'),
                ),
                'public' => true,
                'has_archive' => true,
                'show_in_rest' => true,
                'show_in_menu' => false,
                'publicly_queryable' => true,
                'rewrite' => array('slug' => 'sunform'),
                'supports' => array(
                    'title',
                    'editor'
                ),
            ]
        );
    }

    public function SUNFORM_register_email_template_post_type()
    {
        register_post_type(
            'sun_email_templates',
            [
                'labels' => array(
                    'name' => __('Email Template', 'sunformbuilder'),
                    'singular_name' => __('Email Template', 'sunformbuilder'),
                    'add_new_item' => __('Add New Template', 'sunformbuilder'),
                ),
                'public' => true,
                'has_archive' => true,
                'show_in_menu' => false,
                'publicly_queryable' => false,
                'supports' => array(
                    'title',
                ),
            ]
        );
    }

    public function SUNFORM_email_template_metabox()
    {
        add_meta_box('sunformbuilder-email-template', 'Template', [$this, 'SUNFORM_email_metabox_html'], 'sun_email_templates');
    }
    public function SUNFORM_email_metabox_html($post)
    {
        $template = get_post_meta($post->ID, '_sun_email_template', true);
?>
        <textarea id="sunformbuilder-email-editor" name="email_template"
            style="display:none;"><?php echo esc_textarea($template); ?></textarea>
        <?php
    }

    public function SUNFORM_codemirror_enqueue_scripts($hook)
    {
        global $post;
        if (!empty($post->post_type) && $post->post_type == 'sun_email_templates') {
            $sunform_settings['codeEditor'] = wp_enqueue_code_editor(array('type' => 'htmlmixed'));
            wp_localize_script('jquery', 'sunform_settings', $sunform_settings);
            wp_enqueue_script('wp-theme-plugin-editor');
            wp_enqueue_style('wp-codemirror');
        }
    }

    public function SUNFORM_insert_email_template()
    {
        $args = [
            'post_type'      => 'sun_email_templates',
            'posts_per_page' => -1,
            'post_status'    => 'publish',
        ];

        // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        $post_type = !empty($_GET['post_type']) ? sanitize_key(wp_unslash($_GET['post_type'])) : '';

        $query = new WP_Query($args);
        if (!($query->have_posts()) && 'elementor_library' !== $post_type) {
            $email_template_default = [
                'post_title' => 'Default Email Template',
                'post_status' => 'publish',
                'post_type' => 'sun_email_templates',
            ];
            $email_template_id = wp_insert_post($email_template_default);
            update_post_meta(254896, '_sun_id_email_template_default', $email_template_id);
            update_post_meta($email_template_id, '_sun_email_template', '<div style="margin:0!important;padding:25px 0;background-color:#f3f6f9"><center><div style="border:1px solid #ccc;width:700px;background-color:#fff;border-radius:3px"><div style="padding:20px"><h1>Your Submission</h1><table border="1" style="border-collapse:collapse;color:#000;width:100%">{% for key, item in data %}<tr><th style="padding:10px;text-align:-webkit-auto">{{ item.label }}</th><td style="padding:10px">{{ item.value }}</td></tr>{% endfor %}</table><div style="text-align:-webkit-auto;margin-top:15px">{{ meta_data|raw }}</div></div></div></center></div>');
        } else {
            return;
        }
    }

    public function SUNFORM_save_email_template($post_id)
    {
        if ((defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) || wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) {
            return;
        }

        if (!isset($_POST['_wpnonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['_wpnonce'])), 'update-post_' . $post_id)) {
            return;
        }

        if (!current_user_can('edit_post', $post_id)) {
            return;
        }

        if (empty($_POST['email_template'])) {
            return;
        }

        $raw_template = isset($_POST['email_template']) ? sanitize_textarea_field(wp_unslash($_POST['email_template'])) : '';
        $template = current_user_can('unfiltered_html')
            ? $raw_template
            : wp_kses_post($raw_template);

        update_post_meta($post_id, '_sun_email_template', $template);
    }

    public function SUNFORM_set_custom_edit_columns($columns)
    {
        $columns['sunform-shortcode'] = __('Shortcode', 'sunformbuilder');
        return $columns;
    }
    public function SUNFORM_custom_column($column, $post_id)
    {
        switch ($column) {
            case 'sunform-shortcode':
                $shortcode = sprintf('[sun_form id=%d]', $post_id);
        ?>
                <input class="sunform-widget-shortcode-input" type="text" readonly onfocus="this.select()"
                    value="<?php echo esc_attr($shortcode); ?>" />
<?php
                break;
        }
    }
    public function SUNFORM_get_email_template()
    {
        $args = [
            'post_type' => 'sun_email_templates',
            'post_status' => 'publish',
            'posts_per_page' => -1,
        ];
        $query = new WP_Query($args);

        $post_array = [];

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();

                $post_array[] = array(
                    'label' => get_the_title(),
                    'value' => get_the_ID(),
                );
            }
            wp_reset_postdata();
        }
        return $post_array;
    }

    public function is_sun_settings_page()
    {
        global $post;
        $post_type = isset($post) ? $post->post_type : null;

        // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        $page          = isset($_GET['page']) ? sanitize_key(wp_unslash($_GET['page'])) : '';
        $allowed_pages = ['sun_form_submit', 'sun_settings'];

        return in_array($page, $allowed_pages, true) || 'sun_email_templates' === $post_type;
    }
}
register_activation_hook(__FILE__, ['Sun_Form_Builder', 'activate']);
new Sun_Form_Builder();