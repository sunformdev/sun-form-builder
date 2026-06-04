import { useSelect } from '@wordpress/data';
import AceCode from '../ace-editor/ace-editor.js';
import './css-custom.css';

const CssCustom = ({ attributes, setAttributes, value }) => {
    // const currentDevice = useSelect((select) => {
    //     return select('core/edit-post').__experimentalGetPreviewDeviceType(); // Sai ở đây
    // }, []);
    // const currentDevice = useSelect((select) => {
    //         return select('core/edit-post').__experimentalGetPreviewDeviceType();
    // }, []);
    // const device = currentDevice.toLowerCase();
    // const deviceString = device === 'desktop' ? '' : `:${device}`;

    const handleChangeCssCustom = (newValue) => {
        setAttributes({
            style: {
                ...attributes?.style,
                form: {
                    ...attributes?.style?.form,
                    desktop: {
                        ...attributes?.style?.form?.desktop,
                        css_custom: newValue ?? ''
                    }
                }
            }
        });
    }
    return (
        <>
            <AceCode
                onChange={(newValue) => handleChangeCssCustom(newValue)}
                value={attributes?.style?.form?.desktop?.css_custom}
                device={'desktop'}
                mode="css"
                placeholder="%root% {&#10;background-color:red;&#10;}"
            />
            <p className="wpformbuilder-help-text">Use "%root%" to target the element wrapper.</p>
        </>
    );
};

export default CssCustom;