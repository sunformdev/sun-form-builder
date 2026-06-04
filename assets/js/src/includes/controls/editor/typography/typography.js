const { Dropdown, Button, TextControl, DropdownContentWrapper, SelectControl, __experimentalUnitControl, Flex, FlexItem, Icon } = wp.components;
const { useState } = wp.element;
import LabelResponsive from "../label-responsive/label-responsive";
import { getUnit } from '../../../functions';
import { edit } from '@wordpress/icons';
import './typography.css';

const WPFrombuilderTypography = ({ setAttributes, attributes, onChange, device, property }) => {

    const handleChangeTypography = (newValue, attrName) => {
        if (onChange) {
            onChange(newValue, attrName);
        }
    }

    return (
        <>
            <Flex>
                <FlexItem>
                    <label>Typography</label>
                </FlexItem>
                <FlexItem>
                    <Dropdown
                        className="wpformbuilder-typography-dopdown"
                        contentClassName="wpformbuilder-dropdown-content"
                        popoverProps={{ placement: 'bottom-start' }}
                        focusOnMount={false}
                        onToggle={() => setAttributes({state: {...attributes?.state, openTypography: !attributes?.state?.openTypography}})}
                        open={attributes?.state?.openTypography}
                        onClose={() => setAttributes({ state: { ...attributes?.state, openTypography: false } })}
                        renderToggle={({ open, onToggle }) => (
                            <Button
                                variant="secondary"
                                onClick={onToggle}
                                aria-expanded={open}
                                icon={<Icon icon={edit} size={18} />}
                                style={{ 'min-width': '30px', height: '26px' }}
                            />
                        )}
                        renderContent={() =>
                            <div style={{ width: '250px' }}>
                                <Flex style={{ 'margin-bottom': '5px' }}>
                                    <FlexItem>
                                        <LabelResponsive
                                            label="Size"
                                        />
                                    </FlexItem>
                                    <FlexItem>
                                        <__experimentalUnitControl
                                            onChange={(newValue) => handleChangeTypography(newValue, 'font-size')}
                                            value={attributes?.style?.[property]?.[device]?.['font-size']}
                                            unit={getUnit(attributes?.style?.[property]?.[device]?.['font-size'])}
                                            min={0}
                                            max={9999}
                                            step={1}
                                        />
                                    </FlexItem>
                                </Flex>
                                <SelectControl
                                    label="Weight"
                                    value={attributes?.style?.[property]?.desktop?.['font-weight'] ?? 400}
                                    options={[
                                        { label: '100 (Thin)', value: '100' },
                                        { label: '200 (Extra Light)', value: '200' },
                                        { label: '300 (Light)', value: '300' },
                                        { label: '400 (Normal)', value: '400' },
                                        { label: '500 (Medium)', value: '500' },
                                        { label: '600 (Semi Bold)', value: '600' },
                                        { label: '700 (Bold)', value: '700' },
                                        { label: '800 (Extra Bold)', value: '800' },
                                        { label: '900 (Black)', value: '900' },
                                        { label: 'Normal', value: 'normal' },
                                        { label: 'Bold', value: 'bold' },
                                        { label: 'Default', value: 'default' },
                                    ]}
                                    labelPosition="edge"
                                    className="wpformbuilder-typography-select"
                                    onChange={(newValue) => handleChangeTypography(newValue, 'font-weight')}
                                />
                                <SelectControl
                                    label="Transform"
                                    value={attributes?.style?.[property]?.desktop?.['text-transform'] ?? ''}
                                    options={[
                                        { label: 'Default', value: '' },
                                        { label: 'Uppercase', value: 'uppercase' },
                                        { label: 'Lowercase', value: 'lowercase' },
                                        { label: 'Capitalize', value: 'capitalize' },
                                        { label: 'Normal', value: 'none' },
                                    ]}
                                    labelPosition="edge"
                                    className="wpformbuilder-typography-select"
                                    onChange={(newValue) => handleChangeTypography(newValue, 'text-transform')}
                                />
                                <SelectControl
                                    label="Style"
                                    value={attributes?.style?.[property]?.desktop?.['font-style'] ?? ''}
                                    options={[
                                        { label: 'Default', value: '' },
                                        { label: 'Normal', value: 'normal' },
                                        { label: 'Italic', value: 'italic' },
                                        { label: 'Oblique', value: 'oblique' },
                                    ]}
                                    labelPosition="edge"
                                    className="wpformbuilder-typography-select"
                                    onChange={(newValue) => handleChangeTypography(newValue, 'font-style')}
                                />
                                <SelectControl
                                    label="Decoration"
                                    value={attributes?.style?.[property]?.desktop?.['text-decoration'] ?? ''}
                                    options={[
                                        { label: 'Default', value: '' },
                                        { label: 'Underline', value: 'underline' },
                                        { label: 'Overline', value: 'overline' },
                                        { label: 'Line Through', value: 'line-through' },
                                        { label: 'None', value: 'none' }
                                    ]}
                                    labelPosition="edge"
                                    className="wpformbuilder-typography-select"
                                    onChange={(newValue) => handleChangeTypography(newValue, 'text-decoration')}
                                />
                                <Flex style={{ 'margin-bottom': '5px' }}>
                                    <FlexItem>
                                        <LabelResponsive
                                            label="Line Height"
                                        />
                                    </FlexItem>
                                    <FlexItem>
                                        <__experimentalUnitControl
                                            onChange={(newValue) => handleChangeTypography(newValue, 'line-height')}
                                            value={attributes?.style?.[property]?.[device]?.['line-height']}
                                            unit={getUnit(attributes?.style?.[property]?.[device]?.['line-height'])}
                                            min={0}
                                            max={9999}
                                            step={1}
                                        />
                                    </FlexItem>
                                </Flex>
                                <Flex style={{ 'margin-bottom': '5px' }}>
                                    <FlexItem>
                                        <LabelResponsive
                                            label="Letter Spacing"
                                        />
                                    </FlexItem>
                                    <FlexItem>
                                        <__experimentalUnitControl
                                            onChange={(newValue) => handleChangeTypography(newValue, 'letter-spacing')}
                                            value={attributes?.style?.[property]?.[device]?.['letter-spacing']}
                                            unit={getUnit(attributes?.style?.[property]?.[device]?.['letter-spacing'])}
                                            min={0}
                                            max={9999}
                                            step={1}
                                        />
                                    </FlexItem>
                                </Flex>
                                <Flex style={{ 'margin-bottom': '5px' }}>
                                    <FlexItem>
                                        <LabelResponsive
                                            label="Word Spacing"
                                        />
                                    </FlexItem>
                                    <FlexItem>
                                        <__experimentalUnitControl
                                            onChange={(newValue) => handleChangeTypography(newValue, 'word-spacing')}
                                            value={attributes?.style?.[property]?.[device]?.['word-spacing']}
                                            unit={getUnit(attributes?.style?.[property]?.[device]?.['word-spacing'])}
                                            min={0}
                                            max={9999}
                                            step={1}
                                        />
                                    </FlexItem>
                                </Flex>
                            </div>
                        }
                    />
                </FlexItem>
            </Flex>


        </>
    );
}

export default WPFrombuilderTypography;