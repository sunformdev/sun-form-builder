const { ColorPicker, Popover, ColorIndicator, FlexItem, Button, Icon, Flex } = wp.components;
const { useSelect } = wp.data;
import { rotateLeft } from '@wordpress/icons';
const { useState, useEffect } = wp.element;
const { __ } = wp.i18n;
import './color-picker.css';

const WPFormbuilderColorPicker = ({ onChange, onReset, value, label }) => {
    const handleChangeColorPicker = (newValue) => {
        if (onChange) {
            onChange(newValue);
        }
    }

    const [isOpen, setIsOpen] = useState(false);

    const toggleColorPicker = () => {
        setIsOpen(!isOpen);
    };

    const handleResetColor = () => {
        if(onReset){
            onReset();
        }
    }

    return (
        <>
            <Flex className='wpformbuilder-color-box'>
                <FlexItem>
                    <label>{label ? label : 'Color'}</label>
                </FlexItem>
                <FlexItem>
                    <Button
                        icon={<Icon icon={rotateLeft} size={16} />}
                        label="Reset Color"
                        className="wpformbuilder-button-reset-color"
                        onClick={handleResetColor}
                    />
                    <ColorIndicator className="wpformbuilder-color-indicator"
                        colorValue={value}
                        onClick={toggleColorPicker}
                    />
                </FlexItem>
            </Flex>

            {isOpen && (
                <Popover
                    position="bottom"
                    onClose={() => setIsOpen(false)}
                >
                    <ColorPicker
                        color={value}
                        onChange={(value) => handleChangeColorPicker(value)}
                    />
                </Popover>
            )}
        </>
    );
};

export default WPFormbuilderColorPicker;