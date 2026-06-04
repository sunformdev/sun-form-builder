const { __experimentalInputControl, Flex, FlexItem, Button, Icon } = wp.components;
import { plus, trash, cancelCircleFilled } from '@wordpress/icons';
const { useState, useEffect, useRef } = wp.element;
import './select-group.css';

const WPFrombuilderSelectGroup = ({ setAttributes, attributes, index }) => {

    const handleAddGroups = () => {
        const groupsLength = Object.keys(attributes.fields[index]?.options_group || {}).length;
        const newFields = [...attributes.fields];
        newFields[index] = {
            ...newFields[index],
            options_group: {
                ...newFields[index].options_group,
                [`Group${groupsLength}`]: {}
            }
        };
        setAttributes({ fields: newFields });
    }

    const handleChangeOptionsGroup = (groupName, newValue, attrName, oldKey) => {
        setAttributes({
            fields: attributes.fields.map(field => ({
                ...field,
                options_group: field.options_group && field.options_group[groupName]
                    ? {
                        ...field.options_group,
                        [groupName]: Object.fromEntries(
                            Object.entries(field.options_group[groupName]).map(([key, value]) => {
                                if (attrName === 'key') {
                                    return key === oldKey ? [newValue, value] : [key, value]; // Đổi key
                                } else if (attrName === 'value') {
                                    return key === oldKey ? [key, newValue] : [key, value]; // Đổi value
                                }
                                return [key, value];
                            })
                        )
                    }
                    : field.options_group
            }))
        });
    }

    const handleAddOptionToGroup = (groupName, groups) => {
        let groupsLength = Object.keys(groups || {}).length ?? '0';
        setAttributes({
            fields: attributes.fields.map(field => ({
                ...field,
                options_group: field.options_group && field.options_group[groupName]
                    ? {
                        ...field.options_group,
                        [groupName]: {
                            ...field.options_group[groupName],  // Giữ lại các options cũ
                            [`Key${groupsLength}`]: ''  // Thêm option mới
                        }
                    }
                    : field.options_group
            }))
        });
    }

    const handleRemoveOptionFromGroup = (groupName, optionKey) => {
        setAttributes({
            fields: attributes.fields.map(field => {
                if (field.options_group?.[groupName]) {
                    const { [optionKey]: _, ...updatedGroup } = field.options_group[groupName];

                    return {
                        ...field,
                        options_group: {
                            ...field.options_group,
                            [groupName]: updatedGroup
                        }
                    };
                }
                return field;
            })
        });
    };

    const handleRemoveGroup = (groupName) => {
        setAttributes({
            fields: attributes.fields.map((field, stt) => {
                if (stt === index) {
                    const { [groupName]: _, ...updatedOptionsGroup } = field.options_group; // Loại bỏ nhóm cụ thể

                    return {
                        ...field,
                        options_group: updatedOptionsGroup
                    };
                }
                return field;
            })
        });
    };

    const handChangeGroupName = (oldKey, newGroupName) => {
        const updatedFields = [...attributes?.fields];

        if (updatedFields[index] && updatedFields[index].options_group[oldKey]) {
            const newOptionsGroup = {};
            Object.keys(updatedFields[index].options_group).forEach((groupKey) => {
                if (groupKey === oldKey) {
                    newOptionsGroup[newGroupName] = updatedFields[index].options_group[groupKey];
                } else {
                    newOptionsGroup[groupKey] = updatedFields[index].options_group[groupKey];
                }
            });

            updatedFields[index] = {
                ...updatedFields[index],
                options_group: newOptionsGroup,
            };

            setAttributes({ fields: updatedFields });
        }
    }

    return (
        <>
            {Object.entries(attributes.fields[index]?.options_group ?? {}).map(([index, group]) => (
                <fieldset key={index} className='wpformbuilder-options-fieldset select-group'>
                    <legend style={{ 'marginBottom': '5px' }}>
                        <>
                            <__experimentalInputControl
                                labelPosition="side"
                                type="text"
                                value={index}
                                onChange={(newValue) => handChangeGroupName(index, newValue)}
                                className="wpformbuilder-heigth-25"
                                placeholder="Group name"
                                isPressEnterToChange={true}
                            />
                        </>
                    </legend>
                    {Object.entries(group ?? {}).map(([key, value]) => (
                        <Flex
                            key={key}
                            style={{ 'margin-bottom': '5px' }}>
                            <FlexItem>
                                <__experimentalInputControl
                                    labelPosition="side"
                                    type="text"
                                    value={key}
                                    onChange={(newValue) => handleChangeOptionsGroup(index, newValue, 'key', key)}
                                    className="wpformbuilder-heigth-25"
                                    placeholder="Key"
                                    isPressEnterToChange={true}
                                />
                            </FlexItem>
                            <FlexItem>
                                <Flex>
                                    <FlexItem>
                                        <__experimentalInputControl
                                            labelPosition="side"
                                            type="text"
                                            value={value}
                                            onChange={(newValue) => handleChangeOptionsGroup(index, newValue, 'value', key)}
                                            className="wpformbuilder-heigth-25"
                                            placeholder="Value"
                                            isPressEnterToChange={true}
                                        />
                                    </FlexItem>
                                    <FlexItem>
                                        <Button className='wpformbuilder-remove-options-button' icon={<Icon icon={trash} size={4} />} onClick={() => handleRemoveOptionFromGroup(index, key)}></Button>
                                    </FlexItem>
                                </Flex>
                            </FlexItem>
                        </Flex>
                    ))}
                    <Button className='wpformbuilder-remove-group-button' icon={<Icon icon={cancelCircleFilled} size={9} />} onClick={() => handleRemoveGroup(index)}></Button>
                    <Button className='wpformbuilder-add-options-button' icon={<Icon icon={plus} size={9} />} onClick={() => handleAddOptionToGroup(index, group)}>
                        <span>Add Options</span>
                    </Button>
                </fieldset>
            ))}
            <Button className='wpformbuilder-add-options-button wpformbuilder-options-group' icon={<Icon icon={plus} size={9} />} onClick={handleAddGroups}>
                <span>Add Groups</span>
            </Button>
        </>
    );
}

export default WPFrombuilderSelectGroup;