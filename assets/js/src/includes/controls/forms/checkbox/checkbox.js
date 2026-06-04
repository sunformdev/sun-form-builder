import { getColumnWidth } from '../../../functions';
import './checkbox.css';

const WPformbuilderCheckboxControl = ({ attributes, device, style }) => {
    let hide_label = attributes?.hide_label ?? false;
    let label = attributes?.label ?? '';
    let input_size = attributes?.input_size ?? 'small'
    let width = getColumnWidth(attributes, device, style);
    let checkboxs = attributes?.options ?? {};
    let i = 0;
    let checkbox_attribute = {
        type: 'checkbox',
        name: attributes?.name ?? "", //Sai name trong editor, kiểm tra lại
        className: `wpformbuilder-form-control__field ${input_size}`,
    }
    return (
        <div className="wpformbuilder-form-group" style={{ width: `${width}` }}>
            {!hide_label && (
                <label className="wpformbuilder-form-group__label">{label}</label>
            )}
            <div className="wpformbuilder-form-control email">
                {Object.entries(checkboxs).map(([key, value]) => {
                    const checkboxItemAttr = { ...checkbox_attribute, value, id: attributes?.id + i };
                    i++;
                    return (
                        <div key={key} className='wpformbuilder-checkbox-item'>
                            <div className='wpformbuilder-checkbox-item__input'><input {...checkboxItemAttr} /></div>
                            <label for={checkboxItemAttr['id']}>{key}</label>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
export default WPformbuilderCheckboxControl;