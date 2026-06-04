const { __experimentalInputControl, Flex, FlexItem, Button, Icon } = wp.components;
import { plus, trash } from '@wordpress/icons';
const { useState, useEffect } = wp.element;
import './select-option.css';

const WPFrombuilderSelectOption = ({ setAttributes, attributes, index }) => {

    const handleChangeOptions = (newValue, attrName, oldKey) => {
        const options = attributes.fields[index]?.options || {};
        let newOptions = { ...options };

        if (attrName === 'key') {
            newOptions[newValue] = newOptions[oldKey];
            delete newOptions[oldKey];
        } else if (attrName === 'value') {
            newOptions[oldKey] = newValue;
        }

        setAttributes({
            fields: attributes.fields.map((field, i) =>
                i === index ? { ...field, options: newOptions } : field
            )
        });
    };

    const handleAddOptions = () => {
        console.log('attributes 111: ', attributes);
        const optionsLength = Object.keys(attributes.fields[index]?.options || {}).length;
        const newFields = [...attributes.fields];
        newFields[index] = {
            ...newFields[index],
            options: {
                ...newFields[index].options,
                [`Key${optionsLength}`]: ''
            }
        };
        setAttributes({ fields: newFields });
        console.log('attributes: ', attributes);
    }

    const handleRemoveOptions = (objKey) => {
        const options = attributes.fields[index]?.options || {};
        const updatedOptions = Object.fromEntries(
            Object.entries(options).filter(([key]) => key !== objKey)
        );
        setAttributes({
            fields: attributes.fields.map((field, stt) =>
                stt === index
                    ? {
                        ...field,
                        options: updatedOptions
                    }
                    : field
            )
        });
    }

    return (
        <>
            <fieldset className='wpformbuilder-options-fieldset'>
                <legend>Options</legend>
                {Object.entries(attributes.fields[index]?.options ?? {}).map(([key, value]) => (
                    <Flex key={key} style={{ 'margin-bottom': '5px' }}>
                        <FlexItem>
                            <__experimentalInputControl
                                labelPosition="side"
                                type="text"
                                value={key}
                                onChange={(newValue) => handleChangeOptions(newValue, 'key', key)}
                                className="wpformbuilder-heigth-25"
                                placeholder="Key"
                            />
                        </FlexItem>
                        <FlexItem>
                            <Flex>
                                <FlexItem>
                                    <__experimentalInputControl
                                        labelPosition="side"
                                        type="text"
                                        value={value}
                                        onChange={(newValue) => handleChangeOptions(newValue, 'value', key)}
                                        className="wpformbuilder-heigth-25"
                                        placeholder="Value"
                                    />
                                </FlexItem>
                                <FlexItem>
                                    <Button className='wpformbuilder-remove-options-button' icon={<Icon icon={trash} size={4} />} onClick={() => handleRemoveOptions(key)}></Button>
                                </FlexItem>
                            </Flex>
                        </FlexItem>
                    </Flex>
                ))}
                <Button className='wpformbuilder-add-options-button' icon={<Icon icon={plus} size={9} />} onClick={handleAddOptions}>
                    <span>Add Options</span>
                </Button>
            </fieldset>
        </>
    );
};
export default WPFrombuilderSelectOption;