import { getColumnWidth } from '../../../functions';

const WPformbuilderEmailControl = ({attributes, device, style}) => {
    let hide_label = attributes?.hide_label ?? false;
    let label = attributes?.label ?? '';
    let input_size = attributes?.input_size ?? 'small'
    let width = getColumnWidth(attributes, device, style);
    let email_attribute = {
        type: 'email',
        name: attributes?.name ?? "", //Sai name trong editor, kiểm tra lại
        className: `wpformbuilder-form-control__field ${input_size}`,
        minlength: attributes?.min_length ?? '',
        maxlength: attributes?.max_length ?? '',
        autocomplete: attributes?.autocomplete ?? 'off',
        value: attributes?.default_value ?? '',
        required: attributes?.required ? 'required' : '',
        placeholder: attributes?.placeholder ?? ''
    }
    return (
        <div className="wpformbuilder-form-group" style={{width: `${width}`}}>
            {!hide_label && (
                <label className="wpformbuilder-form-group__label">{label}</label>
            )}
            <div className="wpformbuilder-form-control email">
                <input
                    {...email_attribute}
                />
            </div>
        </div>
    );
}
export default WPformbuilderEmailControl;