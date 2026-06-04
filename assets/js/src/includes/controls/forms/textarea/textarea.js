import { getColumnWidth } from '../../../functions';

const WPformbuilderTextareaControl = ({ attributes, device, style }) => {
    let hide_label = attributes?.hide_label ?? false;
    let label = attributes?.label ?? '';
    let width = getColumnWidth(attributes, device, style);
    let text_attribute = {
        name: attributes?.name ?? "",
        className: `wpformbuilder-form-control__field`,
        minlength: attributes?.min_length ?? '',
        maxlength: attributes?.max_length ?? '',
        autocomplete: attributes?.autocomplete ?? 'off',
        value: attributes?.default_value ?? '',
        required: attributes?.required ? 'required' : '',
        placeholder: attributes?.placeholder ?? '',
        rows: attributes?.rows ?? '4'
    }
    return (
        <>
            <div className="wpformbuilder-form-group" style={{ width: `${width}` }}>
                {!hide_label && (
                    <label className="wpformbuilder-form-group__label">{label}</label>
                )}
                <div className="wpformbuilder-form-control textarea">
                    <textarea {...text_attribute} />
                </div>
            </div>
        </>
    );
};
export default WPformbuilderTextareaControl;