<?php
if (!defined('ABSPATH')) {
    exit;
}

add_action('wp_ajax_sunform_save_css', 'sunform_save_css');

function sunform_save_css()
{
    if (!isset($_POST['nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['nonce'])), 'sun_post_nonce')) {
        wp_send_json_error(['message' => 'Nonce verification failed.'], 403);
    }

    // Post IDs are always positive integers. absint() strips any path-traversal
    // characters (../, /, \) that sanitize_text_field would let through.
    $post_id = isset($_POST['post_id']) ? absint(wp_unslash($_POST['post_id'])) : 0;
    if ($post_id <= 0 || !get_post($post_id)) {
        wp_send_json_error(['message' => 'Invalid post ID.'], 400);
    }

    if (!current_user_can('edit_post', $post_id)) {
        wp_send_json_error(['message' => 'You are not allowed to edit this post.'], 403);
    }

    $css = isset($_POST['css']) ? wp_strip_all_tags(wp_unslash($_POST['css'])) : '';

    if (!file_exists(SUN_FORM_BUILDER_CSS_DIR)) {
        wp_mkdir_p(SUN_FORM_BUILDER_CSS_DIR);
    }

    $css_dir   = realpath(SUN_FORM_BUILDER_CSS_DIR);
    $file_path = trailingslashit(SUN_FORM_BUILDER_CSS_DIR) . $post_id . '.css';

    // Defense-in-depth: ensure the resolved file path is still inside the
    // configured CSS directory after any symlink/normalization resolution.
    $real_parent = realpath(dirname($file_path));
    if ($css_dir === false || $real_parent === false || strpos($real_parent, $css_dir) !== 0) {
        wp_send_json_error(['message' => 'Invalid file path.'], 400);
    }

    global $wp_filesystem;
    if (empty($wp_filesystem)) {
        require_once ABSPATH . 'wp-admin/includes/file.php';
        WP_Filesystem();
    }

    $result = $wp_filesystem->put_contents($file_path, $css, FS_CHMOD_FILE);
    if ($result === false) {
        wp_send_json_error(['message' => 'Failed to write CSS file.'], 500);
    }

    wp_send_json_success(['message' => 'CSS file saved successfully.']);
}
