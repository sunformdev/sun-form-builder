<?php
if ( ! defined( 'ABSPATH' ) ) exit;

class SUNFORM_Settings
{
    public static function sun_admin_notice_success($msg)
    {
        ?>
        <div class="notice notice-success is-dismissible">
            <p><?php echo esc_html($msg); ?></p>
        </div>
        <?php
        add_action('admin_notices', 'sun_admin_notice_success');
    }

    public static function sun_admin_notice_error($msg)
    {
        $class = 'notice notice-error';
        printf(
            '<div class="%1$s"><p>%2$s</p></div>',
            esc_attr($class),
            esc_html($msg)
        );
        add_action('admin_notices', 'sun_admin_notice_error');
    }

    public function wpformbuilder_generate_html_api_input($key, $name, $payment = false)
    {
        ob_start();

        $loading_icon = plugin_dir_url(__FILE__) . '../../assets/images/loading.gif';
        $preview_key = $this->wpformbuilder_hide_api_key($key, $payment);
        $input_name = $name;

        if (!empty($key)) {
            ?>
            <div style="display:flex;">
                <input type="text" class="regular-text wpformbuilder-preview-key" value="<?php echo esc_attr($preview_key); ?>"
                    disabled />
                <input type="hidden" class="regular-text wpformbuilder-hidden-key" value=""
                    name="<?php echo esc_attr($input_name); ?>" />
                <button type="button" class="wpformbuilder-api-save has-preview" data-name="<?php echo esc_attr($input_name); ?>"
                    style="display:none;">
                    <img class="wpformbuilder-loading-icon-save-options" src="<?php echo esc_url($loading_icon); ?>"
                        alt="Loading" />Save
                </button>
                <button type="button" class="wpformbuilder-api-change">Change</button>
                <button type="button" class="wpformbuilder-api-cancel" style="display:none;">Cancel</button>
                <div class="wpformbuilder-notification-save-settings"><?php esc_html_e('Settings Saved.', 'sunformbuilder'); ?>
                </div>
            </div>
            <?php
        } else {
            ?>
            <input type="text" class="regular-text" name="<?php echo esc_attr($input_name); ?>" value="" />
            <button type="button" class="wpformbuilder-api-save" data-name="<?php echo esc_attr($input_name); ?>">
                <img class="wpformbuilder-loading-icon-save-options" src="<?php echo esc_url($loading_icon); ?>"
                    alt="Loading" />Save
            </button>
            <div class="wpformbuilder-notification-save-settings"><?php esc_html_e('Settings Saved.', 'sunformbuilder'); ?></div>
            <?php
        }

        return ob_get_clean();
    }
    public function wpformbuilder_hide_api_key($key, $payment = false)
    {
        if (!empty($key) || $key != false) {
            if ($payment) {
                return substr($key, 0, 10) . '******************' . substr($key, -5);
            } else {
                return '****************************' . substr($key, -5);
            }
        }
        return '';
    }
}
$sunform_admin_setting = new SUNFORM_Settings();
?>
<!-- Teamplate -->
<div class="wrap">
    <h2>Settings</h2>
    <form method="post" action="options.php">
        <?php
        settings_fields('sun_admin_settings');
        do_settings_sections('sun_admin_settings');
        ?>
        <?php
        // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        if (isset($_GET['settings-updated'])) { ?>
            <div id="message" class="updated">
                <p><strong>
                        <?php esc_html_e('Settings saved.', 'sunformbuilder') ?>
                    </strong></p>
            </div>
        <?php } ?>
        <div class="wpformbuilder-admin-tab-container">
            <ul class="wpformbuilder-admin-tab-heading">
                <li><a data-tab="api-setting">Integrations</a></li>
                <li><a data-tab="payment-setting">Payment Integrations</a></li>
            </ul>
            <div class="wpformbuilder-admin-tab-content">
                <div class="wpformbuilder-admin-tab-content_item api-settings active" data-tab-item="api-setting">
                    <div class="wpformbuilder-admin-tab-api__inner">
                        <div class="wpformbuilder-admin-tab-api-content">
                            <!-- Mailchimp -->
                            <div class="wpformbuilder-admin-api-tab wpformbuilder-admin-table"
                                data-api-name="mailchimp">
                                <?php
                                $sunform_mailchimp_api_key = esc_attr(get_option('sun_mailchimp_api_key'));
                                ?>
                                <h4 class="payment-title">Mailchimp</h4>
                                <table class="form-table">
                                    <tr valign="top">
                                        <th scope="row">API Key</th>
                                        <td>

                                            <?php
                                            // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
                                            echo $sunform_admin_setting->wpformbuilder_generate_html_api_input($sunform_mailchimp_api_key, 'sun_mailchimp_api_key');
                                            ?>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                        <div class="wpformbuilder-admin-tab-panel">
                            <div class="wpformbuilder-admin-control-api" style="text-align: center;">
                                <button type="button" class="wpformbuilder-admin-control-api__button check">Show
                                    all</button>
                                <button type="button" class="wpformbuilder-admin-control-api__button uncheck">Hidden
                                    all</button>
                            </div>
                            <ul>
                                <li>
                                    <input type="checkbox" class="wpformbuilder-admin-api-input-item" id="mailchimp"
                                        name="api_name" value="mailchimp" />
                                    <label for="mailchimp"> Mailchimp</label>
                                </li>
                                <li>
                                    <input type="checkbox" class="wpformbuilder-admin-api-input-item" id="getresponse"
                                        name="api_name" value="getresponse" disabled />
                                    <label for="getresponse"> Getresponse</label><a
                                        class="wpformbuilder-get-version-pro" title="Upgrade now" href="#">
                                        (Upgrade)</a>
                                </li>
                                <li>
                                    <input type="checkbox" class="wpformbuilder-admin-api-input-item"
                                        id="activecampaign" name="api_name" value="activecampaign" disabled />
                                    <label for="activecampaign"> Activecampaign</label><a
                                        class="wpformbuilder-get-version-pro" title="Upgrade now" href="#">
                                        (Upgrade)</a>
                                </li>
                                <li>
                                    <input type="checkbox" class="wpformbuilder-admin-api-input-item"
                                        id="google-recaptcha" name="api_name" value="google-recaptcha" disabled />
                                    <label for="google-recaptcha"> Google recaptcha</label><a
                                        class="wpformbuilder-get-version-pro" title="Upgrade now" href="#">
                                        (Upgrade)</a>
                                </li>
                                <li>
                                    <input type="checkbox" class="wpformbuilder-admin-api-input-item" id="google-sheets"
                                        name="api_name" value="google-sheets" disabled />
                                    <label for="google-sheets"> Google Sheets</label><a
                                        class="wpformbuilder-get-version-pro" title="Upgrade now" href="#">
                                        (Upgrade)</a>
                                </li>
                                <li>
                                    <input type="checkbox" class="wpformbuilder-admin-api-input-item" id="zoho-crm"
                                        name="api_name" value="zoho-crm" disabled />
                                    <label for="zoho-crm"> Zoho CRM</label><a class="wpformbuilder-get-version-pro"
                                        title="Upgrade now" href="#"> (Upgrade)</a>
                                </li>
                                <li>
                                    <input type="checkbox" class="wpformbuilder-admin-api-input-item" id="mailerlite"
                                        name="api_name" value="mailerlite" disabled />
                                    <label for="mailerlite"> Mailerlite</label><a class="wpformbuilder-get-version-pro"
                                        title="Upgrade now" href="#"> (Upgrade)</a>
                                </li>
                                <li>
                                    <input type="checkbox" class="wpformbuilder-admin-api-input-item" id="sendinblue"
                                        name="api_name" value="sendinblue" disabled />
                                    <label for="sendinblue"> Sendinblue</label><a class="wpformbuilder-get-version-pro"
                                        title="Upgrade now" href="#"> (Upgrade)</a>
                                </li>
                                <li>
                                    <input type="checkbox" class="wpformbuilder-admin-api-input-item" id="sendfox"
                                        name="api_name" value="sendfox" disabled />
                                    <label for="sendfox"> Sendfox</label><a class="wpformbuilder-get-version-pro"
                                        title="Upgrade now" href="#"> (Upgrade)</a>
                                </li>
                                <li>
                                    <input type="checkbox" class="wpformbuilder-admin-api-input-item"
                                        id="constantcontact" name="api_name" value="constantcontact" disabled />
                                    <label for="constantcontact"> Constantcontact</label><a
                                        class="wpformbuilder-get-version-pro" title="Upgrade now" href="#">
                                        (Upgrade)</a>
                                </li>
                            </ul>
                            <hr>
                            <?php submit_button(); ?>
                        </div>
                    </div>
                </div>
                <div class="wpformbuilder-admin-tab-content_item payment-settings" data-tab-item="payment-setting">
                    <div class="wpformbuilder-admin-tab-wrap" style="width: 100%;">
                        <div class="wpformbuilder-admin-tab-api__inner">
                            <div class="wpformbuilder-admin-tab-api-content">
                                <!-- Stripe Payment -->
                                <div class="wpformbuilder-admin-tab-payment stripe" data-api-name="stripe">
                                    <?php
                                    $sunform_stripe_publishable_key = esc_attr(get_option('wpformbuilder_stripe_publishable_key'));
                                    $sunform_stripe_secret_key = esc_attr(get_option('wpformbuilder_stripe_secret_key'));
                                    ?>
                                    <h4 class="payment-title">Stripe</h4>
                                    <table class="form-table">
                                        <tbody>
                                            <tr>
                                                <td>Publishable key</td>
                                                <td>
                                                    <?php
                                                    // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
                                                    echo $sunform_admin_setting->wpformbuilder_generate_html_api_input($sunform_stripe_publishable_key, 'wpformbuilder_stripe_publishable_key', 'stripe');
                                                    ?>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Secret key</td>
                                                <td>

                                                    <?php
                                                    // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
                                                    echo $sunform_admin_setting->wpformbuilder_generate_html_api_input($sunform_stripe_secret_key, 'wpformbuilder_stripe_secret_key', 'stripe');
                                                    ?>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="wpformbuilder-admin-tab-panel">
                                <div class="wpformbuilder-admin-control-api" style="text-align: center;">
                                    <button type="button" class="wpformbuilder-admin-control-api__button check">Show
                                        all</button>
                                    <button type="button" class="wpformbuilder-admin-control-api__button uncheck">Hidden
                                        all</button>
                                </div>
                                <ul>
                                    <li>
                                        <input type="checkbox" class="wpformbuilder-admin-api-input-item" id="stripe"
                                            name="api_name" value="stripe" />
                                        <label for="stripe"> Stripe Payment</label><a
                                            class="wpformbuilder-get-version-pro" title="Upgrade now" href="#">
                                            (Upgrade)</a>
                                    </li>
                                </ul>
                                <hr>
                                <?php submit_button(); ?>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <?php
            $sunform_debug_mode = get_option('sun_debug_mode');
            ?>
            <!-- Debug Mode -->
            <div class="wpformbuilder-debug-mode" style="display: none;"><label>Debug mode</label><input type="text"
                    name="sun_debug_mode" value="<?php echo esc_attr($sunform_debug_mode); ?>"></div>

    </form>
</div>