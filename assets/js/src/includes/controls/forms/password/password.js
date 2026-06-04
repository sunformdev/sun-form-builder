import { getColumnWidth } from '../../../functions';

const WPformbuilderPasswordControl = ({ attributes, device, style }) => { // Làm thêm show hiden password
    let hide_label = attributes?.hide_label ?? false;
    let input_size = attributes?.input_size ?? 'small'
    let label = attributes?.label ?? '';
    let width = getColumnWidth(attributes, device, style);
    let text_attribute = {
        type: 'password',
        name: attributes?.name ?? "",
        className: `wpformbuilder-form-control__field ${input_size}`,
        minlength: attributes?.min_length ?? '',
        maxlength: attributes?.max_length ?? '',
        autocomplete: attributes?.autocomplete ?? 'off',
        value: attributes?.default_value ?? '',
        required: attributes?.required ? 'required' : '',
        placeholder: attributes?.placeholder ?? ''
    }
    return (
        <>
            <div className="wpformbuilder-form-group" style={{ width: `${width}` }}>
                {!hide_label && (
                    <label className="wpformbuilder-form-group__label">{label}</label>
                )}
                <div className="wpformbuilder-form-control password">
                    <input {...text_attribute} />
                </div>
            </div>
        </>
    );
};
export default WPformbuilderPasswordControl;