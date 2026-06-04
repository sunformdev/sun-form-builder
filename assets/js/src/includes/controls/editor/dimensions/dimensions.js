const { __ } = wp.i18n;
const { useBlockProps, InspectorControls } = wp.blockEditor;
const { PanelBody, __experimentalDivider, __experimentalSpacer, Flex, FlexItem, __experimentalToggleGroupControl, __experimentalToggleGroupControlOption, SelectControl, __experimentalNumberControl, Button, Icon } = wp.components;
const { useState } = wp.element;
import { border, desktop, link, linkOff } from '@wordpress/icons';
const { useSelect } = wp.data;
import './dimensions.css';

const WPFrombuilderDimensions = ({ label, onChange, value }) => {
    const [dimensions, setDimensions] = useState(value ?? { top: '', right: '', bottom: '', left: '', unit: 'px', link: true });

    const handleDimensionChange = (side, value, isLink) => {
        let newDimensions;
        if (isLink) {
            if (value) {
                let top = (dimensions?.top || dimensions?.top !== "") ? dimensions.top : '0';
                newDimensions = { ...dimensions, top: top, left: top, bottom: top, right: top, link: value };
            }else{
                newDimensions = { ...dimensions, [side]: value };
            }
        } else {
            if (['px', '%', 'rem', 'em', 'vw', 'vh'].includes(value)) {
                newDimensions = { ...dimensions, [side]: value };
            } else {
                if (dimensions.link) {
                    newDimensions = { ...dimensions, top: value, left: value, bottom: value, right: value };
                } else {
                    newDimensions = { ...dimensions, [side]: value };
                }
            }

        }
        setDimensions(newDimensions);

        if (onChange) {
            onChange(newDimensions);
        }
    }
    return (
        <>
            <Flex>
                <FlexItem>
                    <label>{label}</label>
                </FlexItem>
                <FlexItem style={{ 'margin-top': '-4px' }}>
                    <__experimentalToggleGroupControl
                        __nextHasNoMarginBottom
                        isBlock
                        className="wpformbuilder-dimensions-unit-options"
                        onChange={(newValue) => handleDimensionChange('unit', newValue, false)}
                        value={value?.unit ?? 'px'}
                    >
                        <__experimentalToggleGroupControlOption
                            label="PX"
                            value="px"
                            className='wpformbuilder-dimensions-unit'
                        />
                        <__experimentalToggleGroupControlOption
                            label="%"
                            value="%"
                            className='wpformbuilder-dimensions-unit'
                        />
                        <__experimentalToggleGroupControlOption
                            label="EM"
                            value="em"
                            className='wpformbuilder-dimensions-unit'
                        />
                        <__experimentalToggleGroupControlOption
                            label="REM"
                            value="rem"
                            className='wpformbuilder-dimensions-unit'
                        />
                        <__experimentalToggleGroupControlOption
                            label="VW"
                            value="vw"
                            className='wpformbuilder-dimensions-unit'
                        />
                        <__experimentalToggleGroupControlOption
                            label="VH"
                            value="vh"
                            className='wpformbuilder-dimensions-unit'
                        />
                    </__experimentalToggleGroupControl>
                </FlexItem>
            </Flex>
            <div className='wpformbuilder-dimensions-control' style={{ marginTop: '8px' }}>
                <div className='wpformbuilder-dimensions-control__item'>
                    <__experimentalNumberControl
                        value={value?.top ?? ''}
                        onChange={(value) => handleDimensionChange('top', value, false)}
                        min={0}
                    />
                    <div style={{ 'textAlign': 'center', fontSize: '10px' }}>Top</div>
                </div>
                <div className='wpformbuilder-dimensions-control__item right'>
                    <__experimentalNumberControl
                        value={value?.right ?? ''}
                        onChange={(value) => handleDimensionChange('right', value, false)}
                        min={0}
                    />
                    <div style={{ 'textAlign': 'center', fontSize: '10px' }}>Right</div>
                </div>
                <div className='wpformbuilder-dimensions-control__item'>
                    <__experimentalNumberControl
                        value={value?.bottom ?? ''}
                        onChange={(value) => handleDimensionChange('bottom', value, false)}
                        min={0}
                    />
                    <div style={{ 'textAlign': 'center', fontSize: '10px' }}>Bottom</div>
                </div>
                <div className='wpformbuilder-dimensions-control__item left'>
                    <__experimentalNumberControl
                        value={value?.left ?? ''}
                        onChange={(value) => handleDimensionChange('left', value, false)}
                        min={0}
                    />
                    <div style={{ 'textAlign': 'center', fontSize: '10px' }}>Left</div>
                </div>
                <div className='wpformbuilder-dimensions-control__item'>
                    <Button
                        onClick={() => handleDimensionChange('link', !value?.link, true)}
                        className={`wpformbuilder-button-dimensions-link ${value?.link ? 'has-link' : 'link-off'}`}
                        icon={<Icon icon={value?.link ? link : linkOff} size={18} />}
                    >
                    </Button>
                </div>
            </div>
        </>
    );
}

export default WPFrombuilderDimensions;