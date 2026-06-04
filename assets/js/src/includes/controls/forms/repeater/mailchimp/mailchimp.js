const { Button, SelectControl, PanelBody, Icon, __experimentalHeading, __experimentalInputControl } = wp.components;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { plus } from '@wordpress/icons';
const { useState, useMemo, useEffect } = wp.element;
import './mailchimp.css';

const RepeaterMailchimp = ({ value, onChange, attributes }) => {
    const [openPanel, setOpenPanel] = useState('');
    const handleChangeTag = (index, newTag) => {
        const updated = [...value];
        updated[index].tag_name = newTag;
        onChange(updated);
    };

    useEffect(() => {
        const updated = [...value];
        let hasChanged = false;

        const setIfMatch = (tag, newValue) => {
            const i = updated.findIndex((item, idx) => idx < 2 && item.tag_name === tag && !item.field_name);
            if (i !== -1) {
                updated[i].field_name = newValue;
                hasChanged = true;
            }
        };

        setIfMatch('email_address', fieldOptions?.[0]?.value ?? '');
        setIfMatch('status', 'subscribed');

        if (hasChanged) onChange(updated);
    }, []);

    const handleChangeShortcode = (index, newShortcode) => {
        const updated = [...value];
        updated[index].field_name = newShortcode;
        onChange(updated);
    };

    const handleChangeCustomField = (index, newValue) => {
        const updated = [...value];
        updated[index].custom_value = newValue;
        onChange(updated);
    };

    const addRepeater = () => {
        onChange([
            ...value,
            { tag_name: attributes?.action_submit_settings?.mailchimp?.fields?.[0]?.value, field_name: fieldOptions?.[0]?.value ?? '', custom_value: '', address: { addr1: fieldOptions?.[0]?.value ?? '', city: fieldOptions?.[0]?.value ?? '', state: fieldOptions?.[0]?.value ?? '', zip: fieldOptions?.[0]?.value ?? '' } },
        ]);
    };

    const removeRepeater = (index) => {
        const updated = [...value];
        updated.splice(index, 1);
        onChange(updated);
    };

    const fieldOptions = useMemo(() => {
        const fields = attributes?.fields ?? [];
        let options = [];
        for (const field of fields) {
            options.push({ label: field?.label, value: field?.name });
        }
        options.push({ label: 'Custom Value', value: 'custom_value' });
        return options;
    }, [attributes?.fields]);

    const fieldAddressOptions = useMemo(() => {
        const fields = attributes?.fields ?? [];
        return (is_required = false) => {
            let options = is_required ? [] : [{ label: '-- Select --', value: '' }];
            for (const field of fields) {
                options.push({ label: field?.label, value: field?.name });
            }
            // options.push({ label: 'Custom Value', value: 'custom_value' });
            return options;
        };
    }, [attributes?.fields]);

    const handleChangeAddressTag = (name, index, newValue) => {
        const updated = [...value];
        const currentItem = { ...updated[index] };
        const currentAddress = { ...(currentItem.address || {}) };

        currentAddress[name] = newValue;
        currentItem.address = currentAddress;
        updated[index] = currentItem;

        onChange(updated);
    };

    return (
        <>
            <__experimentalHeading level="4" style={{ marginBottom: '10px', 'font-size': '13px' }}>Mapping Fields</__experimentalHeading>
            {value.map((item, index) => (
                <PanelBody
                    key={index}
                    title={item?.tag_name || `Item ${index + 1}`}
                    className='wpformbuilder-repeater-map-field-panel'
                    icon={!['email_address', 'status'].includes(item.tag_name) ? <FontAwesomeIcon icon={faXmark} className='wpformbuilder-remove-attribute-button' onClick={() => removeRepeater(index)} /> : null}
                    opened={index === openPanel}
                    onToggle={() => setOpenPanel(index === openPanel ? null : index)}
                >
                    {['email_address', 'status'].includes(item.tag_name) && (
                        <>
                            {item?.tag_name === 'email_address' && (
                                <SelectControl
                                    label="Tag Name"
                                    value={'email_address'}
                                    options={[{ label: 'Email (required)', value: 'email_address' }]}
                                    onChange={(val) => handleChangeTag(index, val)}
                                    disabled={true}
                                />
                            )}
                            {item?.tag_name === 'status' && (
                                <>
                                    <SelectControl
                                        label="Tag Name"
                                        value={'status'}
                                        options={[
                                            { label: 'Status (required)', value: 'status' }
                                        ]}
                                        onChange={(val) => handleChangeTag(index, val)}
                                        disabled={true}
                                    />
                                    <SelectControl
                                        label="Value"
                                        value={
                                            attributes?.action_submit_settings?.mailchimp?.send_confirm_email
                                                ? 'pending'
                                                : item?.field_name ?? 'subscribed'
                                        }
                                        options={[
                                            { label: 'Subscribed', value: 'subscribed' },
                                            { label: 'Unsubscribed', value: 'unsubscribed' },
                                            { label: 'Cleaned', value: 'cleaned' },
                                            { label: 'Pending', value: 'pending' },
                                            { label: 'Transactional', value: 'transactional' }
                                        ]}
                                        onChange={(val) => handleChangeShortcode(index, val)}
                                        disabled={attributes?.action_submit_settings?.mailchimp?.send_confirm_email}
                                    />
                                </>
                            )}
                        </>

                    )}
                    {!['email_address', 'status'].includes(item.tag_name) && (
                        <>
                            <SelectControl
                                label="Tag Name"
                                value={item.tag_name || ''}
                                options={attributes?.action_submit_settings?.mailchimp?.fields}
                                onChange={(val) => handleChangeTag(index, val)}
                            />
                        </>
                    )}
                    {!['status', 'ADDRESS'].includes((item?.tag_name)) && (
                        <>
                            <SelectControl
                                label="Field"
                                value={item?.field_name ?? fieldOptions?.[0]?.value}
                                options={fieldOptions}
                                onChange={(val) => handleChangeShortcode(index, val)}
                            />
                            {item?.field_name === 'custom_value' && (
                                <__experimentalInputControl
                                    label="Custom Value"
                                    labelPosition="top"
                                    value={item?.custom_value || ''}
                                    onChange={(val) => handleChangeCustomField(index, val)}
                                />
                            )}
                        </>
                    )}
                    {['ADDRESS'].includes(item?.tag_name) && (
                        <>
                            <SelectControl
                                label="Address 1 (required)"
                                value={item?.address?.addr1 ?? ''}
                                options={fieldAddressOptions(true)}
                                onChange={(val) => handleChangeAddressTag('addr1', index, val)}
                            />
                            <SelectControl
                                label="City (required)"
                                value={item?.address?.city ?? ''}
                                options={fieldAddressOptions(true)}
                                onChange={(val) => handleChangeAddressTag('city', index, val)}
                            />
                            <SelectControl
                                label="State (required)"
                                value={item?.address?.state ?? ''}
                                options={fieldAddressOptions(true)}
                                onChange={(val) => handleChangeAddressTag('state', index, val)}
                            />
                            <SelectControl
                                label="Zip (required)"
                                value={item?.address?.zip ?? ''}
                                options={fieldAddressOptions(true)}
                                onChange={(val) => handleChangeAddressTag('zip', index, val)}
                            />
                            <SelectControl
                                label="Address 2"
                                value={item?.address?.addr2 ?? ''}
                                options={fieldAddressOptions(false)}
                                onChange={(val) => handleChangeAddressTag('addr2', index, val)}
                            />
                            <SelectControl
                                label="Country"
                                value={item?.address?.country ?? ''}
                                options={fieldAddressOptions(false)}
                                onChange={(val) => handleChangeAddressTag('country', index, val)}
                            />
                        </>
                    )}

                </PanelBody>
            ))}

            <Button className="wpformbuilder-button-add-repeater-map-field" style={{ margin: '0 auto', display: 'flex', height: '30px', position: 'relative' }} variant="primary" onClick={addRepeater} icon={<Icon icon={plus} size={14} style={{ width: '24px' }} />}><span style={{ marginBottom: '3px' }}>Add Item</span></Button>
        </>
    );
};
export default RepeaterMailchimp;