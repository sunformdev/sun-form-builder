import { getColumnWidth } from '../../../functions';
import './radio.css';

const WPformbuilderRadioControl = ({ attributes, device, style }) => {
    let hide_label = attributes?.hide_label ?? false;
    let label = attributes?.label ?? '';
    let input_size = attributes?.input_size ?? 'small'
    let width = getColumnWidth(attributes, device, style);
    let radios = attributes?.options ?? {};
    let i = 0;
    let radio_attribute = {
        type: 'radio',
        name: attributes?.name ?? "", //Sai name trong editor, kiểm tra lại
        className: `wpformbuilder-form-control__field ${input_size}`,
    }
    return (
        <div className="wpformbuilder-form-group" style={{ width: `${width}` }}>
            {!hide_label && (
                <label className="wpformbuilder-form-group__label">{label}</label>
            )}
            <div className="wpformbuilder-form-control email">
                {Object.entries(radios).map(([key, value]) => {
                    const radioItemAttr = { ...radio_attribute, value, id: attributes?.id + i };
                    i++;
                    return (
                        <div className='wpformbuilder-radio-item' key={key}>
                            <div className='wpformbuilder-radio-item__input'><input {...radioItemAttr} /></div>
                            <label for={radioItemAttr['id']}>{key}</label>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
export default WPformbuilderRadioControl;