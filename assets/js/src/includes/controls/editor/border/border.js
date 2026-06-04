const { __ } = wp.i18n;
const { useBlockProps, InspectorControls } = wp.blockEditor;
const { PanelBody, __experimentalDivider, __experimentalSpacer, __experimentalToggleGroupControl, __experimentalToggleGroupControlOption, SelectControl, __experimentalNumberControl, Button, Icon } = wp.components;
import WPFrombuilderDimensions from '../dimensions/dimensions';
import WPFormbuilderColorPicker from '../color-picker/color-picker';
import './border.css';

const WPFrombuilderBorder = ({ attributes, setAttributes, property, focusColor = true, style }) => {

    const handleChangeBorderStyle = (newStyle) => {
        setAttributes({
            style: {
                ...attributes?.style,
                [property]: {
                    ...attributes?.style?.[property],
                    desktop: {
                        ...attributes?.style?.[property]?.desktop,
                        border: {
                            ...attributes?.style?.[property]?.desktop?.border,
                            type: newStyle
                        }
                    }
                }
            }
        });
    }

    const handleChangeBorderWidth = (newValue) => {
        setAttributes({
            style: {
                ...attributes?.style,
                [property]: {
                    ...attributes?.style?.[property],
                    desktop: {
                        ...attributes?.style?.[property]?.desktop,
                        border: {
                            ...attributes?.style?.[property]?.desktop?.border,
                            width: {
                                top: newValue?.top,
                                right: newValue?.right,
                                bottom: newValue?.bottom,
                                left: newValue?.left,
                                unit: newValue?.unit,
                                link: newValue?.link
                            }
                        }
                    }
                }
            }
        });
    }

    const handleChangeBorderColor = (newColor, type, isReset) => {
        setAttributes({
            style: {
                ...attributes?.style,
                [property]: {
                    ...attributes?.style?.[property],
                    desktop: {
                        ...attributes?.style?.[property]?.desktop,
                        border: {
                            ...attributes?.style?.[property]?.desktop?.border,
                            [type]: isReset ? '' : newColor
                        }
                    }
                }
            }
        })
    }
    return (
        <>
            <div style={style}>
                <SelectControl
                    label="Border Style"
                    value={attributes?.style?.[property]?.desktop?.border?.type}
                    options={[
                        { label: 'Default', value: '' },
                        { label: 'None', value: 'none' },
                        { label: 'Solid', value: 'solid' },
                        { label: 'Dotted', value: 'dotted' },
                        { label: 'Dashed', value: 'dashed' },
                        { label: 'Double', value: 'double' },
                        { label: 'Groove', value: 'groove' },
                        { label: 'Inset', value: 'inset' },
                        { label: 'Outset', value: 'outset' },
                        { label: 'Ridge', value: 'ridge' },
                    ]}
                    labelPosition="edge"
                    onChange={(newValue) => handleChangeBorderStyle(newValue)}
                    className="wpformbuilder-input-size-select"
                />
                {['solid', 'dotted', 'dashed', 'double', 'groove', 'inset', 'outset', 'ridge'].includes(attributes?.style?.[property]?.desktop?.border?.type) && (
                    <>
                        <WPFrombuilderDimensions label='Width' value={attributes?.style?.[property]?.desktop?.border?.width} onChange={(newValue) => handleChangeBorderWidth(newValue)} />
                        <WPFormbuilderColorPicker
                            onChange={(newColor) => handleChangeBorderColor(newColor, 'color', false)}
                            value={attributes?.style?.[property]?.desktop?.border?.color}
                            onReset={() => handleChangeBorderColor('', 'color', true)}
                        />
                        <WPFormbuilderColorPicker
                            label={'Hover Color'}
                            onChange={(newColor) => handleChangeBorderColor(newColor, 'hoverColor', false)}
                            value={attributes?.style?.[property]?.desktop?.border?.hoverColor}
                            onReset={() => handleChangeBorderColor('', 'hoverColor', true)}
                        />
                        {focusColor && (
                            <WPFormbuilderColorPicker
                                label={'Focus Color'}
                                onChange={(newColor) => handleChangeBorderColor(newColor, 'focusColor', false)}
                                value={attributes?.style?.[property]?.desktop?.border?.focusColor}
                                onReset={() => handleChangeBorderColor('', 'focusColor', true)}
                            />
                        )}
                    </>
                )}
            </div>
        </>
    );
}

export default WPFrombuilderBorder;