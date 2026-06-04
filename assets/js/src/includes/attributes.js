import ShortUniqueId from 'short-unique-id';
import { createResponsiveStyle } from '../includes/functions';
import { background, desktop, table, typography } from '@wordpress/icons';
const generateID = new ShortUniqueId({ length: 5, dictionary: 'alpha_lower' });

const formStyle = {
    column_gap: {
        value: '10px',
        unit: 'px'
    },
    row_gap: {
        value: '10px',
        unit: 'px'
    }
}
const labelStyle = {
    spacing: '',
    'font-weight': '400',
    'font-size': '',
    'text-transform': '',
    'font-style': '',
    'text-decoration': '',
    'line-height': '',
    'letter-spacing': '',
    'word-spacing': '',
    color: ''
}
const fieldStyle = {
    color: '',
    'background-color': '',
    'font-weight': '400',
    'font-size': '',
    'text-transform': '',
    'font-style': '',
    'text-decoration': '',
    'line-height': '',
    'letter-spacing': '',
    'word-spacing': '',
    border: {
        type: '',
        style: '',
        width: {
            top: '',
            right: '',
            bottom: '',
            left: '',
            link: '',
            unit: 'px',
            link: true
        },
        color: '',
        hoverColor: '',
        focusColor: '',
        radius: {
            top: '',
            right: '',
            bottom: '',
            left: '',
            link: '',
            unit: 'px',
            link: true
        }
    },
    padding: {
        top: '',
        right: '',
        bottom: '',
        left: '',
        link: '',
        unit: 'px',
        link: true
    },
    margin: {
        top: '',
        right: '',
        bottom: '',
        left: '',
        link: '',
        unit: 'px',
        link: true
    }
}
const buttonStyle = {
    'justify-content': '',
    'font-weight': '400',
    'text-align': 'center',
    'font-size': '',
    'text-transform': '',
    'font-style': '',
    'text-decoration': '',
    'line-height': '',
    'letter-spacing': '',
    'word-spacing': '',
    'width': '100%',
    border: {
        type: '',
        style: '',
        width: {
            top: '',
            right: '',
            bottom: '',
            left: '',
            link: '',
            unit: 'px',
            link: true
        },
        color: '',
        hoverColor: '',
        focusColor: '',
        radius: {
            top: '',
            right: '',
            bottom: '',
            left: '',
            link: '',
            unit: 'px',
            link: true
        }
    },
    color: '',
    hoverColor: '',
    'background-color': '',
    backgroundHoverColor: '',
    padding: {
        top: '',
        right: '',
        bottom: '',
        left: '',
        link: '',
        unit: 'px',
        link: true
    },
    margin: {
        top: '',
        right: '',
        bottom: '',
        left: '',
        link: '',
        unit: 'px',
        link: true
    }
}
const default_fields = [
    {
        id: 'wp' + generateID.rnd(),
        type: 'text',
        default_value: '',
        label: 'First Name',
        autocomplete: 'off',
        required: false,
        name: 'fname',
        column_width: {
            desktop: '100%',
            tablet: '100%',
            mobile: '100%'
        }
    },
    {
        id: 'wp' + generateID.rnd(),
        type: 'text',
        default_value: '',
        label: 'Last Name',
        autocomplete: 'off',
        required: false,
        name: 'lname',
        column_width: {
            desktop: '100%',
            tablet: '100%',
            mobile: '100%'
        }
    },
    {
        id: 'wp' + generateID.rnd(),
        type: 'email',
        default_value: '',
        label: 'Email',
        autocomplete: 'off',
        required: false,
        name: 'email',
        column_width: {
            desktop: '100%',
            tablet: '100%',
            mobile: '100%'
        }
    }
]
const attributes = {
    action_submit: {
        type: 'array',
        default: ['Email']
    },
    action_submit_settings: {
        type: 'object',
        default: {
            email: {
                to: null,
                subject: null,
                template: null,
                from: null,
                from_name: null,
                reply_to: null,
                cc: null,
                bcc: null,
                meta_data: ['Date', 'Time', 'Page URL', 'User Agent', 'Remote IP']
            },
            mailchimp: {
                type: 'default',
                api_key_cusom: null,
                send_confirm_email: false,
                update_contact: false,
                acceptance_field: false,
                list_ids: [],
                fields: [],
                groups: {},
                list_id_selected: null,
                groups_id_selected: [],
                mappings: [
                    { tag_name: 'email_address', field_name: '', custom_value: '' },
                    { tag_name: 'status', field_name: 'subscribed', custom_value: '' },
                ]
            }
        }
    },
    form: {
        type: 'object',
        default: {
            name: 'New Form',
            id: "",
            post_form: '',
            hide_label: false,
            input_size: 'small',
            save_to_database: true,
            upgrade: {
                link: 'https://wp-formbuilder.com/#pricing'
            }
        }
    },
    state: {
        type: 'object',
        default: {
            repeater: '',
            openTab: 'setting',
            inRepeater: 'normal',
            openTypography: false,
            section: 'form-field',
            icon: 'all'
        }
    },
    button: {
        type: 'object',
        default: {
            name: 'Submit',
            size: 'sm',
            icon: {
                type: 'none',
                group: '',
                name: '',
                id: '',
                url: '',
                mime: '',
                position: 'right',
                spacing: '10px'
            }
        }
    },
    css: {
        type: 'object',
        default: {
            editor: '',
            custom: ''
        }
    },
    render_attributes: {
        type: "object",
        default: {
            id: 'wp' + generateID.rnd(),
            type: 'text',
            label: '',
            autocomplete: 'off',
            name: generateID.rnd(),
            placeholder: '',
            default_value: '',
            min_length: '',
            max_length: '',
            min: '',
            max: '',
            step: '',
            rows: '4',
            options_width_group: false,
            options: {},
            options_group: {},
            required: false,
            multiple: false,
            column_width: {
                desktop: '100%',
                tablet: '100%',
                mobile: '100%'
            }
        }
    },
    fields: {
        type: 'object',
        default: []
    },
    style: {
        type: 'object',
        default: {
            form: {
                ...createResponsiveStyle(formStyle)
            },
            label: {
                ...createResponsiveStyle(labelStyle)
            },
            field: {
                ...createResponsiveStyle(fieldStyle)
            },
            button: {
                ...createResponsiveStyle(buttonStyle)
            }
        }
    },
    additional_options: {
        type: 'object',
        default: {
            messages: {
                success: 'Your submission was successful.',
                error: 'Your submission failed because of an error.',
                required: 'This field is required.'
            }
        }
    }
}


export { attributes, default_fields };