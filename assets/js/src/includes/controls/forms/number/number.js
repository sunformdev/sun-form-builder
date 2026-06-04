import { getColumnWidth } from '../../../functions';

const WPformbuilderNumberControl = ({ attributes, device, style }) => {
    let hide_label = attributes?.hide_label ?? false;
    let label = attributes?.label ?? '';
    let input_size = attributes?.input_size ?? 'small'
    let width = getColumnWidth(attributes, device, style);
    let number_attribute = {
        type: 'number',
        name: attributes?.name ?? "",
        className: `wpformbuilder-form-control__field ${input_size}`,
        minlength: attributes?.min_length ?? '',
        maxlength: attributes?.max_length ?? '',
        step: attributes?.step ?? '',
        autocomplete: attributes?.autocomplete ?? 'off',
        value: attributes?.default_value ?? '',
        required: attributes?.required ? 'required' : '',
        placeholder: attributes?.placeholder ?? ''
    }
    return (
        <div className="wpformbuilder-form-group" style={{ width: `${width}` }}>
            {!hide_label && (
                <label className="wpformbuilder-form-group__label">{label}</label>
            )}
            <div className="wpformbuilder-form-control number">
                <input
                    {...number_attribute}
                />
            </div>
        </div>
    );
}
export default WPformbuilderNumberControl;