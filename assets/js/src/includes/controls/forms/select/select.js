import { getColumnWidth } from '../../../functions';
import './select.css';

const WPformbuilderSelectControl = ({ attributes, device, style }) => {
    let hide_label = attributes?.hide_label ?? false;
    let input_size = attributes?.input_size ?? 'small'
    let label = attributes?.label ?? '';
    let width = getColumnWidth(attributes, device, style);
    let options = attributes?.options ?? {};
    let select_attribute = {
        name: attributes?.name ?? "",
        className: `wpformbuilder-form-control__field ${input_size}`,
        required: attributes?.required ? 'required' : '',
        defaultValue: attributes?.default_value ?? '',
        multiple: attributes?.multiple ?? '',
    }
    return (
        <>
            <div className="wpformbuilder-form-group" style={{ width: `${width}` }}>
                {!hide_label && (
                    <label className="wpformbuilder-form-group__label">{label}</label>
                )}
                <div className="wpformbuilder-form-control select">
                    <select {...select_attribute}>
                        {Object.entries(options).map(([key, value]) => {
                            let option_attributes = {
                                value: value
                            };
                            return (
                                <option key={key} {...option_attributes}>
                                    {key}
                                </option>
                            );
                        })}
                    </select>
                </div>
            </div>
        </>
    );
};
export default WPformbuilderSelectControl;