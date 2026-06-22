const { __ } = wp.i18n;
const { InspectorControls, RichText, useBlockProps } = wp.blockEditor;
const { TabPanel, PanelBody, SelectControl, BaseControl, Notice, ComboboxControl, TextControl, Flex, FlexBlock, FormTokenField, __experimentalToggleGroupControl, __experimentalToggleGroupControlOptionIcon, __experimentalSpacer, __experimentalDivider, FlexItem, __experimentalUnitControl, __experimentalNumberControl, __experimentalInputControl, ToggleControl, Button, Icon } = wp.components;
import { button, desktop, plus, settings, justifyLeft, justifyRight, justifySpaceBetween, plugins, justifyCenter, alignLeft, alignCenter, alignRight, alignJustify, arrowLeft, arrowRight, cog, brush } from '@wordpress/icons';
import { attributes, default_fields } from '../../includes/attributes';
const { useState, useEffect } = wp.element;
const { useSelect } = wp.data;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faSync, faCog } from '@fortawesome/free-solid-svg-icons'
import { generateFormCSS, generateLabelCSS, generateFieldCSS, getUnit, generateButtonCSS, generateColumnCSS } from '../../includes/functions.js'
import { WPFormbuilderGetAPIData } from '../../includes/integrations.js';
import WPformbuilderTextControl from '../../includes/controls/forms/text/text.js';
import ShortUniqueId from 'short-unique-id';
import WPformbuilderNumberControl from '../../includes/controls/forms/number/number';
import WPformbuilderEmailControl from '../../includes/controls/forms/email/email';
import WPformbuilderTelControl from '../../includes/controls/forms/tel/tel';
import WPformbuilderURLControl from '../../includes/controls/forms/url/url';
import WPformbuilderTextareaControl from '../../includes/controls/forms/textarea/textarea';
import WPformbuilderPasswordControl from '../../includes/controls/forms/password/password';
import WPformbuilderHiddenControl from '../../includes/controls/forms/hidden/hidden';
import WPformbuilderSelectControl from '../../includes/controls/forms/select/select';
import WPformbuilderCheckboxControl from '../../includes/controls/forms/checkbox/checkbox.js';
import WPformbuilderRadioControl from '../../includes/controls/forms/radio/radio.js';
import LabelResponsive from '../../includes/controls/editor/label-responsive/label-responsive.js';
import WPFrombuilderTypography from '../../includes/controls/editor/typography/typography.js';
import WPFrombuilderSelectOption from '../../includes/controls/editor/select-option/select-option.js';
import WPFrombuilderSelectGroup from '../../includes/controls/editor/select-group/select-group.js';
import WPFormbuilderColorPicker from '../../includes/controls/editor/color-picker/color-picker.js';
import WPFrombuilderBorder from '../../includes/controls/editor/border/border.js';
import CssCustom from '../../includes/controls/editor/css-custom/css-custom.js';
import WPFrombuilderDimensions from '../../includes/controls/editor/dimensions/dimensions.js';
import RepeaterMailchimp from '../../includes/controls/forms/repeater/mailchimp/mailchimp.js';
import UpgradeLabel from '../../includes/controls/editor/upgrade-label/upgrade-label.js';
import IconControl from '../../includes/controls/editor/icon/icon.js';
// import '@material/web/textfield/outlined-text-field.js';

wp.blocks.registerBlockType('sunformbuilder/form', {
    apiVersion: 2,
    title: __('Form'),
    icon: button,
    category: 'wpformbuilder',
    attributes: attributes,
    edit: (props) => {
        const { attributes, setAttributes } = props;
        const generateID = new ShortUniqueId({ length: 5, dictionary: 'alphanum_lower' });
        const [css, setCSS] = useState('');
        const [spin, setSpin] = useState({ mailchimp: false });

        const attributeField = {
            className: 'wpformbuilder-form-field'
        }

        const currentDevice = useSelect((select) => {
            return select('core/edit-post').__experimentalGetPreviewDeviceType();
        }, []);
        const device = currentDevice.toLowerCase();
        const [openIndex, setOpenIndex] = useState(null);

        useEffect(() => {
            if (!attributes?.form?.id) {
                setAttributes({ form: { ...attributes?.form, id: generateID.rnd() } });
            }
            if (!attributes?.form?.post_form) {
                setAttributes({ form: { ...attributes?.form, post_form: wp.data.select('core/editor').getCurrentPostId() } });
            }
            if (!attributes?.fields.length) {
                setAttributes({ fields: default_fields });
            }

            const cssForm = generateFormCSS(attributes);
            const cssLabel = generateLabelCSS(attributes);
            const cssField = generateFieldCSS(attributes);
            const cssButton = generateButtonCSS(attributes);
            const cssColumn = generateColumnCSS(attributes);
            console.log('cssButton: ', cssButton);

            const finalCss = cssForm + cssLabel + cssField + cssButton;
            setCSS(finalCss);
            if (attributes?.css?.editor !== (finalCss + cssColumn)) {
                setAttributes({ css: { ...attributes?.css, editor: finalCss + cssColumn } });
            }
            console.log('attributes ----> ', attributes);
        }, [attributes]);

        useEffect(() => {
            setOpenIndex(attributes?.state?.repeater);
        }, device);

        const attributeForm = useBlockProps({
            className: `wpformbuilder-form wpformbuilder-form-${attributes?.form?.id}`,
        })

        const addItem = () => {
            const newItems = [...attributes?.fields, attributes.render_attributes];
            // setLocalItems(newItems);
            setAttributes({ fields: newItems });
            setOpenIndex(newItems.length - 1);
            setAttributes({ state: { ...attributes?.state, repeater: newItems.length - 1 } });
        };

        const setFormAttribute = (newValue, attrName, index) => {
            const newItems = [...attributes?.fields];
            if (newItems[index]) {
                newItems[index][attrName] = newValue;
                // setLocalItems(newItems);
                setAttributes({ fields: newItems });
            }
        }

        const setFormStyle = (newValue, styleName, type) => {
            const updatedStyle = {
                ...attributes.style,
                form: {
                    ...attributes?.style?.form,
                    [device]: {
                        ...attributes.style?.form?.[device],
                        [styleName]: {
                            ...attributes.style?.form?.[device][styleName],
                            [type]: newValue
                        }
                    }
                }

            };
            setAttributes({ ...attributes, style: updatedStyle });
        }

        const removeItem = (index) => {
            const newItems = attributes?.fields.filter((_, i) => i !== index);
            setAttributes({ fields: newItems });
            if (index === openIndex) {
                setOpenIndex(null);
            }
        };

        const handleSetColumnWidth = (width, index) => {
            const newItems = [...attributes?.fields];
            newItems[index]['column_width'][device] = width;
            // setLocalItems(newItems);
            setAttributes({ ...attributes?.fields, fields: newItems });
        }

        const handleChangeFormTypography = (newValue, attrName, type) => {
            const updatedStyle = {
                ...attributes.style,
                [type]: {
                    ...attributes?.style?.[type],
                    [device]: {
                        ...attributes.style?.[type]?.[device],
                        [attrName]: newValue
                    }
                }

            };
            setAttributes({ ...attributes, style: updatedStyle });
        }

        const handleSetOpenRepeater = (index) => {
            setOpenIndex(openIndex === index ? null : index);
            setAttributes({ state: { ...attributes?.state, repeater: openIndex === index ? null : index } });
        }

        const handleSetOpenSection = async (name, toggle = false) => {
            setAttributes({ state: { ...(attributes?.state || {}), section: attributes?.state?.section === name ? '' : name } });
            if (['mailchimp'].includes(name) && toggle && sfbuilder_js_data?.api?.[name]) {
                setSpin({ [name]: true });
                await WPFormbuilderGetAPIData(name, attributes, setAttributes);
                setSpin({ [name]: false });
            }
        }

        const handleReloadDataAPi = async (apiName) => {
            setSpin({ mailchimp: true });
            await WPFormbuilderGetAPIData(apiName, attributes, setAttributes);
            setSpin({ mailchimp: false });
        }

        const handleChangeBorderRadius = (newRadius, attrName) => {
            setAttributes({
                style: {
                    ...attributes?.style,
                    [attrName]: {
                        ...attributes?.style?.[attrName],
                        desktop: {
                            ...attributes?.style?.[attrName]?.desktop,
                            border: {
                                ...attributes?.style?.[attrName]?.desktop?.border,
                                radius: {
                                    top: newRadius?.top,
                                    right: newRadius?.right,
                                    bottom: newRadius?.bottom,
                                    left: newRadius?.left,
                                    unit: newRadius?.unit,
                                    link: newRadius?.link
                                }
                            }
                        }
                    }
                }
            });
        }

        const handleSpacing = (newSpacing, attrName, chilName) => {
            setAttributes({
                style: {
                    ...attributes?.style,
                    [attrName]: {
                        ...attributes?.style?.[attrName],
                        [device]: {
                            ...attributes?.style?.[attrName]?.[device],
                            [chilName]: {
                                top: newSpacing?.top,
                                right: newSpacing?.right,
                                bottom: newSpacing?.bottom,
                                left: newSpacing?.left,
                                unit: newSpacing?.unit,
                                link: newSpacing?.link
                            }
                        }
                    }
                }
            });
        }

        const handleChangeApiSettings = async (apiName, property, value) => {
            const updatedApiSettings = {
                ...attributes?.action_submit_settings?.[apiName],
                [property]: value
            };

            if (property === 'type' && value === 'default') {
                updatedApiSettings.api_key_cusom = null;
            }

            const updatedAttributes = {
                ...attributes,
                action_submit_settings: {
                    ...attributes?.action_submit_settings,
                    [apiName]: updatedApiSettings
                }
            };

            setAttributes(updatedAttributes);
            if (['api_key_cusom', 'type'].includes(property)) {
                setSpin({ mailchimp: true });
                await WPFormbuilderGetAPIData(apiName, updatedAttributes, setAttributes);
                setSpin({ mailchimp: false });
            }
        }

        const handleChangeAdditionalOptions = (optionName, property, value) => {
            setAttributes({
                additional_options: {
                    ...attributes?.additional_options,
                    [optionName]: {
                        ...attributes?.additional_options?.[optionName],
                        [property]: value
                    }
                }
            });
        }

        const handleChangeGroupMailchimp = (labels) => {
            labels = labels ?? [];
            let groups = attributes?.action_submit_settings?.mailchimp?.groups ?? {};
            let value = [];
            for (const label of labels) {
                if (groups.hasOwnProperty(label)) {
                    value.push(groups?.[label]);
                }
            }
            setAttributes({
                action_submit_settings: {
                    ...attributes?.action_submit_settings,
                    mailchimp: {
                        ...attributes?.action_submit_settings?.mailchimp,
                        groups_id_selected: value
                    }
                }
            });
        }

        const getGroupsMailchimpValue = (group_seclect) => {
            if (group_seclect.length) {
                let groups = attributes?.action_submit_settings?.mailchimp?.groups ?? []
                let groupsLabel = [];
                for (const group in groups) {
                    if (group_seclect.includes(groups?.[group])) {
                        groupsLabel.push(group);
                    }
                }
                return groupsLabel;
            }
        }

        const handleChangeListIDMailchimp = async (value) => {
            setSpin({ mailchimp: true });
            const newAttributes = {
                action_submit_settings: {
                    ...attributes?.action_submit_settings,
                    mailchimp: {
                        ...attributes?.action_submit_settings?.mailchimp,
                        list_id_selected: value
                    }
                }
            };

            setAttributes(newAttributes);
            await WPFormbuilderGetAPIData('mailchimp', newAttributes, setAttributes);
            setSpin({ mailchimp: false });
        }

        return (
            <>
                <InspectorControls>
                    <TabPanel
                        className="wpformbuilder-tab-panel"
                        activeClass="active-tab"
                        onSelect={(tabName) => setAttributes({ state: { ...attributes?.state, openTab: tabName } })} // Open section nữa
                        initialTabName={attributes.state.openTab}
                        tabs={[
                            {
                                name: 'setting',
                                title: (
                                    <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Icon icon={cog} size={20} />
                                        <span style={{ fontSize: '12px' }}>Settings</span>
                                    </span>
                                ),
                                className: 'wpformbuilder-tab-setting',
                            },
                            {
                                name: 'style',
                                title: (
                                    <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Icon icon={brush} size={20} />
                                        <span style={{ fontSize: '12px' }}>Style</span>
                                    </span>
                                ),
                                className: 'wpformbuilder-tab-style',
                            },
                        ]}
                    >
                        {(tab) => <div>
                            {attributes.state.openTab === 'setting' && (
                                <>
                                    <PanelBody title={<UpgradeLabel label="Form Fields" attributes={attributes} />} opened={attributes?.state?.section === 'form-field'} onToggle={() => handleSetOpenSection('form-field')} className={`wpformbuilder-panel-toggle`}>
                                        <div className="wpformbuilder-custom-attribute-control">
                                            <__experimentalInputControl
                                                label="Form Name"
                                                labelPosition="side"
                                                className="wpformbuilder-form-name"
                                                value={attributes?.form?.name ?? ""}
                                                style={{ 'margin-top': '10px' }}
                                                onChange={(newValue) => setAttributes({ form: { ...attributes?.form, name: newValue } })}
                                            />
                                            {attributes?.fields.map((item, index) => (
                                                <PanelBody
                                                    key={index}
                                                    title={__(item?.label ? item?.label : `Item #${index + 1}`)}
                                                    className='wpformbuilder-custom-attribute-panel'
                                                    icon={<FontAwesomeIcon icon={faXmark} className='wpformbuilder-remove-attribute-button' onClick={() => removeItem(index)} />}
                                                    opened={index === openIndex}
                                                    onToggle={() => handleSetOpenRepeater(index)}
                                                >
                                                    <div className="wpformbuilder-custom-attribute-control__item">
                                                        <TabPanel
                                                            className="wpformbuilder-tab-repeater"
                                                            activeClass="active-tab"
                                                            onSelect={(tabName) => setAttributes({ state: { ...attributes?.state, inRepeater: tabName } })}
                                                            initialTabName={attributes?.state?.inRepeater}
                                                            tabs={[
                                                                {
                                                                    name: 'normal',
                                                                    title: 'Normal',
                                                                    className: 'wpformbuilder-tab-normal',
                                                                },
                                                                {
                                                                    name: 'advanced',
                                                                    title: 'Advanced',
                                                                    className: 'wpformbuilder-tab-advanced',
                                                                },
                                                            ]}
                                                        >
                                                            {(tabs) => <div>
                                                                {attributes?.state?.inRepeater == 'normal' && (
                                                                    <>
                                                                        <SelectControl
                                                                            label="Type"
                                                                            value={item?.type ? item?.type : 'text'}
                                                                            options={[
                                                                                { label: 'Text', value: 'text' },
                                                                                { label: 'Nunber', value: 'number' },
                                                                                { label: 'Email', value: 'email' },
                                                                                { label: 'Tel', value: 'tel' },
                                                                                { label: 'URL', value: 'url' },
                                                                                { label: 'Textarea', value: 'textarea' },
                                                                                { label: 'Select', value: 'select' },
                                                                                { label: 'Checkbox', value: 'checkbox' },
                                                                                { label: 'Radio', value: 'radio' },
                                                                                { label: 'Hidden', value: 'hidden' },
                                                                                { label: 'Password', value: 'password' },
                                                                                { label: 'Date (Only Pro)', value: 'date', disabled: 'true' },
                                                                                { label: 'Time (Only Pro)', value: 'time', disabled: 'true' },
                                                                                { label: 'HTML (Only Pro)', value: 'html', disabled: 'true' },
                                                                                { label: 'IBAN (Only Pro)', value: 'iban', disabled: 'true' },
                                                                                { label: 'File Upload (Only Pro)', value: 'file_upload', disabled: 'true' },
                                                                                { label: 'Image Upload (Only Pro)', value: 'image_upload', disabled: 'true' },
                                                                            ]}
                                                                            labelPosition="edge"
                                                                            className="wpformbuilder-heading-select"
                                                                            onChange={(newValue) => setFormAttribute(newValue, 'type', index)}
                                                                        />
                                                                        <__experimentalInputControl
                                                                            label="Label"
                                                                            labelPosition="side"
                                                                            value={item?.label ? item?.label : ''}
                                                                            onChange={(newValue) => setFormAttribute(newValue, 'label', index)}
                                                                        />
                                                                        <__experimentalInputControl
                                                                            label="ID (name)"
                                                                            labelPosition="side"
                                                                            value={item?.name ? item?.name : ''}
                                                                            title={'Use meaningful names written in lowercase, without spaces or special characters (except _ or -). Eg: email_address'}
                                                                            onChange={(newValue) => setFormAttribute(newValue, 'name', index)}
                                                                            className='wpformbuilder-width-35'
                                                                        />
                                                                        {['text', 'password', 'email', 'tel', 'number', 'textarea', 'hidden'].includes(item?.type) && (
                                                                            <__experimentalInputControl
                                                                                label="Placeholder"
                                                                                labelPosition="side"
                                                                                value={item?.placeholder ? item?.placeholder : ''}
                                                                                onChange={(newValue) => setFormAttribute(newValue, 'placeholder', index)}
                                                                            />
                                                                        )}
                                                                        {['select'].includes(item?.type) && (
                                                                            <>
                                                                                <Flex style={{ 'margin-bottom': '13px' }}>
                                                                                    <FlexItem>
                                                                                        <label>Use selection groups</label>
                                                                                    </FlexItem>
                                                                                    <FlexItem className="wpformbuilder-no-margin-bootom">
                                                                                        <ToggleControl
                                                                                            __nextHasNoMarginBottom={true}
                                                                                            checked={item?.options_width_group ? item?.options_width_group : false}
                                                                                            onChange={(toogle) => setFormAttribute(toogle, 'options_width_group', index)}
                                                                                        />
                                                                                    </FlexItem>
                                                                                </Flex>
                                                                                {!item?.options_width_group && (
                                                                                    <WPFrombuilderSelectOption attributes={attributes} setAttributes={setAttributes} index={index} />
                                                                                )}
                                                                                {item?.options_width_group && (
                                                                                    <WPFrombuilderSelectGroup attributes={attributes} setAttributes={setAttributes} index={index} />
                                                                                )}
                                                                                <Flex style={{ 'margin-bottom': '15px', 'margin-top': '13px' }}>
                                                                                    <FlexItem>
                                                                                        <label>Multiple</label>
                                                                                    </FlexItem>
                                                                                    <FlexItem className="wpformbuilder-no-margin-bootom">
                                                                                        <ToggleControl
                                                                                            __nextHasNoMarginBottom={true}
                                                                                            checked={item?.multiple ? item?.multiple : false}
                                                                                            onChange={(toogle) => setFormAttribute(toogle, 'multiple', index)}
                                                                                        />
                                                                                    </FlexItem>
                                                                                </Flex>
                                                                            </>
                                                                        )}

                                                                        {['checkbox', 'radio'].includes(item?.type) && (
                                                                            <>
                                                                                <WPFrombuilderSelectOption attributes={attributes} setAttributes={setAttributes} index={index} />
                                                                            </>
                                                                        )}

                                                                        <Flex style={{ 'margin-bottom': '15px', 'margin-top': '13px' }}>
                                                                            <FlexItem>
                                                                                <label>Required</label>
                                                                            </FlexItem>
                                                                            <FlexItem className="wpformbuilder-no-margin-bootom">
                                                                                <ToggleControl
                                                                                    __nextHasNoMarginBottom={true}
                                                                                    checked={item?.required ? item?.required : false}
                                                                                    onChange={(toogle) => setFormAttribute(toogle, 'required', index)}
                                                                                />
                                                                            </FlexItem>
                                                                        </Flex>
                                                                        {['number'].includes(item?.type) && (
                                                                            <>
                                                                                <__experimentalInputControl
                                                                                    label="Min"
                                                                                    labelPosition="side"
                                                                                    type="number"
                                                                                    value={item?.min ? item?.min : ''}
                                                                                    onChange={(newValue) => setFormAttribute(newValue, 'min', index)}
                                                                                    className="wpformbuilder-width-35"
                                                                                />
                                                                                <__experimentalInputControl
                                                                                    label="Max"
                                                                                    labelPosition="side"
                                                                                    value={item?.max ? item?.max : ''}
                                                                                    type="number"
                                                                                    onChange={(newValue) => setFormAttribute(newValue, 'max', index)}
                                                                                    className="wpformbuilder-width-35"
                                                                                />
                                                                                <__experimentalInputControl
                                                                                    label="Step"
                                                                                    labelPosition="side"
                                                                                    value={item?.step ? item?.step : ''}
                                                                                    type="number"
                                                                                    onChange={(newValue) => setFormAttribute(newValue, 'step', index)}
                                                                                />
                                                                            </>
                                                                        )}
                                                                        <__experimentalInputControl
                                                                            label="Autocomplete"
                                                                            labelPosition="side"
                                                                            value={item?.autocomplete ? item?.autocomplete : 'on'}
                                                                            type="text"
                                                                            onChange={(newValue) => setFormAttribute(newValue, 'autocomplete', index)}
                                                                            isPressEnterToChange={true}
                                                                        />
                                                                        <__experimentalInputControl
                                                                            label="Default value"
                                                                            labelPosition="side"
                                                                            value={item?.default_value ? item?.default_value : ''}
                                                                            type={item?.type === 'number' ? 'number' : 'text'}
                                                                            onChange={(newValue) => setFormAttribute(newValue, 'default_value', index)}
                                                                        />
                                                                        {['textarea'].includes(item?.type) && (
                                                                            <__experimentalInputControl
                                                                                label="Rows"
                                                                                labelPosition="side"
                                                                                value={item?.rows ? item?.rows : '4'}
                                                                                type="number"
                                                                                onChange={(newValue) => setFormAttribute(newValue, 'rows', index)}
                                                                                className="wpformbuilder-width-35"
                                                                            />
                                                                        )}

                                                                        <Flex>
                                                                            <FlexItem>
                                                                                <LabelResponsive
                                                                                    label="Width"
                                                                                    attributes={attributes}
                                                                                    setAttributes={setAttributes}
                                                                                />
                                                                            </FlexItem>
                                                                            <FlexItem className="wpformbuilder-flex-block-no-margin">
                                                                                <SelectControl
                                                                                    value={item?.column_width?.[device] ?? '100%'}
                                                                                    options={[
                                                                                        { label: '20%', value: '20%' },
                                                                                        { label: '25%', value: '25%' },
                                                                                        { label: '30%', value: '30%' },
                                                                                        { label: '33%', value: '33%' },
                                                                                        { label: '40%', value: '40%' },
                                                                                        { label: '50%', value: '50%' },
                                                                                        { label: '60%', value: '60%' },
                                                                                        { label: '66%', value: '66%' },
                                                                                        { label: '70%', value: '70%' },
                                                                                        { label: '75%', value: '75%' },
                                                                                        { label: '80%', value: '80%' },
                                                                                        { label: '100%', value: '100%' },
                                                                                        { label: 'Default', value: 'default' },
                                                                                    ]}
                                                                                    labelPosition="edge"
                                                                                    onChange={(newValue) => handleSetColumnWidth(newValue, index)}
                                                                                />
                                                                            </FlexItem>
                                                                        </Flex>


                                                                    </>
                                                                )}
                                                                {attributes?.state?.inRepeater == 'advanced' && (
                                                                    <>
                                                                        {['text', 'password', 'email', 'tel', 'number', 'textarea '].includes(item?.type) && (
                                                                            <>
                                                                                <__experimentalInputControl
                                                                                    label="Min Length"
                                                                                    labelPosition="side"
                                                                                    type="number"
                                                                                    value={item?.min_length ? item?.min_length : ''}
                                                                                    onChange={(newValue) => setFormAttribute(newValue, 'min_length', index)}
                                                                                />
                                                                                <__experimentalInputControl
                                                                                    label="Max Length"
                                                                                    labelPosition="side"
                                                                                    value={item?.max_length ? item?.max_length : ''}
                                                                                    type="number"
                                                                                    onChange={(newValue) => setFormAttribute(newValue, 'max_length', index)}
                                                                                />
                                                                            </>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </div>}
                                                        </TabPanel>
                                                    </div>
                                                </PanelBody>
                                            ))}
                                            <div className='wpformbuilder-add-button-box' style={{ textAlign: 'center' }}>
                                                <Button className='wpformbuilder-add-attribute-button' icon={<Icon icon={plus} size={14} />} onClick={addItem}>
                                                    <span>Add Item</span>
                                                </Button>
                                            </div>
                                            <__experimentalDivider margin="1" />
                                            <SelectControl
                                                label="Input size"
                                                value={attributes?.form?.input_size}
                                                options={[
                                                    { label: 'Extra Small', value: 'extra-small' },
                                                    { label: 'Small', value: 'small' },
                                                    { label: 'Medium', value: 'medium' },
                                                    { label: 'Large', value: 'large' },
                                                ]}
                                                labelPosition="edge"
                                                className="wpformbuilder-input-size-select"
                                                onChange={(newValue) => setAttributes({ form: { ...attributes?.form, input_size: newValue } })}
                                            />
                                            <__experimentalDivider margin="1" />
                                            <Flex>
                                                <FlexItem>
                                                    <label>Hide Label</label>
                                                </FlexItem>
                                                <FlexItem className="wpformbuilder-no-margin-bootom">
                                                    <ToggleControl
                                                        __nextHasNoMarginBottom={true}
                                                        checked={attributes?.form?.hide_label}
                                                        onChange={(toogle) => setAttributes({ form: { ...attributes?.form, hide_label: toogle } })} // Đang ở đây, làm hide label
                                                    />
                                                </FlexItem>
                                            </Flex>

                                        </div>
                                    </PanelBody>
                                    <PanelBody title={<UpgradeLabel label="Buttons" attributes={attributes} />} opened={attributes?.state?.section === 'buttons'} onToggle={() => handleSetOpenSection('buttons')} className={`wpformbuilder-panel-toggle`}>
                                        <div className='wpformbuilder-buttons-settings'>
                                            <__experimentalInputControl
                                                label="Submit"
                                                labelPosition="edge"
                                                value={attributes?.button?.name}
                                                type="text"
                                                onChange={(newValue) => setAttributes({ button: { ...attributes?.button, name: newValue } })}
                                                className='wpformbuilder-width-33 wpformbuilder-text-capitalize'
                                            />
                                            <SelectControl
                                                label="Size"
                                                value={attributes?.button?.size ?? 'sm'}
                                                options={[
                                                    { label: 'Extra Small', value: 'xs' },
                                                    { label: 'Small', value: 'sm' },
                                                    { label: 'Medium', value: 'md' },
                                                    { label: 'Large', value: 'lg' },
                                                    { label: 'Extra Large', value: 'xl' }
                                                ]}
                                                labelPosition="edge"
                                                className="wpformbuilder-width-33 wpformbuilder-text-capitalize"
                                                onChange={(newValue) => setAttributes({ button: { ...attributes?.button, size: newValue } })}
                                            />
                                            <Flex style={{ marginBottom: '10px' }}>
                                                <FlexItem>
                                                    <LabelResponsive
                                                        label="Width"
                                                        attributes={attributes}
                                                        setAttributes={setAttributes}
                                                    />
                                                </FlexItem>
                                                <FlexItem className="wpformbuilder-flex-block-no-margin">
                                                    <SelectControl
                                                        value={attributes?.style?.button?.[device]?.['width']}
                                                        options={[
                                                            { label: '20%', value: '20%' },
                                                            { label: '25%', value: '25%' },
                                                            { label: '30%', value: '30%' },
                                                            { label: '33%', value: '33%' },
                                                            { label: '40%', value: '40%' },
                                                            { label: '50%', value: '50%' },
                                                            { label: '60%', value: '60%' },
                                                            { label: '66%', value: '66%' },
                                                            { label: '70%', value: '70%' },
                                                            { label: '75%', value: '75%' },
                                                            { label: '80%', value: '80%' },
                                                            { label: '100%', value: '100%' },
                                                            { label: 'Default', value: '' },
                                                        ]}
                                                        labelPosition="edge"
                                                        onChange={(newValue) => setAttributes({ style: { ...attributes?.style, button: { ...attributes?.style?.button, [device]: { ...attributes?.style?.button?.[device], 'width': newValue } } } })}
                                                    />
                                                </FlexItem>
                                            </Flex>
                                            <IconControl label="Icon" attributes={attributes} setAttributes={setAttributes} />
                                            {(attributes?.button?.icon?.type !== 'none' && (attributes?.button?.icon?.name || attributes?.button?.icon?.url)) && (
                                                <>
                                                    <Flex style={{ 'margin-top': '10px' }}>
                                                        <FlexItem>
                                                            <label>Icon Position</label>
                                                        </FlexItem>
                                                        <FlexItem style={{ 'margin-top': '-5px', marginBottom: '10px' }}>
                                                            <__experimentalToggleGroupControl
                                                                __nextHasNoMarginBottom
                                                                isBlock
                                                                onChange={(newValue) => setAttributes({ button: { ...attributes?.button, icon: { ...attributes?.button?.icon, position: newValue ?? 'right' } } })}
                                                                className="wpformbuilder-button-options"
                                                                value={attributes?.style?.button?.icon?.position ?? 'right'}
                                                            >
                                                                <__experimentalToggleGroupControlOptionIcon
                                                                    icon={<Icon icon={arrowLeft} width={18} />}
                                                                    label="Left"
                                                                    value="left"
                                                                    className={`wpformbuilder-button-toggle-icon-position`}
                                                                    style={{ borderRight: '1px solid #8f8f8f' }}
                                                                />
                                                                <__experimentalToggleGroupControlOptionIcon
                                                                    icon={<Icon icon={arrowRight} width={18} />}
                                                                    label="Right"
                                                                    value="right"
                                                                    className={`wpformbuilder-button-toggle-icon-position`}
                                                                />
                                                            </__experimentalToggleGroupControl>
                                                        </FlexItem>
                                                    </Flex>
                                                    <__experimentalUnitControl
                                                        label="Icon Spacing"
                                                        className='wpformbuilder-width-70 wpformbuilder-text-capitalize'
                                                        labelPosition="edge"
                                                        onChange={(newValue) =>
                                                            setAttributes({
                                                                button: {
                                                                    ...attributes.button,
                                                                    icon: {
                                                                        ...attributes.button.icon,
                                                                        spacing: newValue
                                                                    }
                                                                }
                                                            })
                                                        }
                                                        value={attributes?.button?.icon?.spacing ?? "10px"}
                                                        unit={getUnit(attributes?.button?.icon?.spacing)}
                                                        min={0}
                                                        max={9999}
                                                        step={1}
                                                    />
                                                </>
                                            )}

                                        </div>
                                    </PanelBody>
                                    <PanelBody title={__('Actions After Submit')} opened={attributes?.state?.section === 'action-submit'} onToggle={() => handleSetOpenSection('action-submit')} className={`wpformbuilder-panel-toggle`}>
                                        <div className='wpformbuilder-action-submit'>
                                            <FormTokenField
                                                __experimentalExpandOnFocus
                                                __nextHasNoMarginBottom
                                                label="Add Action"
                                                onChange={(newValue) => setAttributes({ action_submit: newValue })}
                                                suggestions={
                                                    [
                                                        'Email',
                                                        'Email 2',
                                                        'Mailchimp'
                                                    ]
                                                }
                                                value={attributes?.action_submit ?? 'Email 2'}
                                                __experimentalShowHowTo={false}
                                            />
                                            <__experimentalDivider margin="1" />
                                            <Flex>
                                                <FlexItem>
                                                    <BaseControl
                                                        id="wpformbuilder-save-to-database"
                                                        label={
                                                            <>
                                                                <span>Save To Database </span>
                                                                <Button
                                                                    isLink
                                                                    href={attributes?.form?.upgrade?.link}
                                                                    target="_blank"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    className="wpformbuilder-button-upgrade"
                                                                >
                                                                    <span> (Upgrade)</span>
                                                                </Button>
                                                            </>
                                                        }
                                                    ></BaseControl>
                                                </FlexItem>
                                                <FlexItem style={{ marginBottom: '5px' }}>
                                                    <ToggleControl
                                                        __nextHasNoMarginBottom={true}
                                                        checked={attributes?.form?.save_to_database}
                                                        disabled={true}
                                                        onChange={(toogle) => setAttributes({ form: { ...attributes?.form, save_to_database: toogle } })} // Đang ở đây, làm hide label
                                                    />
                                                </FlexItem>
                                            </Flex>
                                        </div>
                                    </PanelBody>
                                    {attributes?.action_submit.includes('Email') && (
                                        <PanelBody className="wpformbuilder-action-section wpformbuilder-panel-toggle" title={<UpgradeLabel label="Email" attributes={attributes} />} opened={attributes?.state?.section === 'email'} onToggle={() => handleSetOpenSection('email')}>
                                            <__experimentalInputControl
                                                label="To"
                                                labelPosition="top"
                                                help="You can send to multiple emails, separated by commas."
                                                value={attributes?.action_submit_settings?.email?.to ?? sfbuilder_js_data?.admin_email}
                                                type="text"
                                                onChange={(newValue) => handleChangeApiSettings('email', 'to', newValue)}
                                            />
                                            <__experimentalInputControl
                                                label="Subject"
                                                labelPosition="top"
                                                value={attributes?.action_submit_settings?.email?.subject ?? `New message from ${sfbuilder_js_data?.blog_name}`}
                                                type="text"
                                                onChange={(newValue) => handleChangeApiSettings('email', 'subject', newValue)}
                                            />
                                            <SelectControl
                                                label="Email Template"
                                                value={attributes?.action_submit_settings?.email?.template ?? sfbuilder_js_data?.email_templates_default}
                                                options={sfbuilder_js_data?.email_templates}
                                                labelPosition="edge"
                                                className="wpformbuilder-heading-select"
                                                onChange={(newValue) => handleChangeApiSettings('email', 'template', newValue)}
                                            />
                                            <__experimentalInputControl
                                                label="From Email"
                                                labelPosition="edge"
                                                value={attributes?.action_submit_settings?.email?.from ?? sfbuilder_js_data?.from_email}
                                                type="text"
                                                onChange={(newValue) => handleChangeApiSettings('email', 'from', newValue)}
                                                className='wpformbuilder-width-33'
                                            />
                                            <__experimentalInputControl
                                                label="From Name"
                                                labelPosition="edge"
                                                value={attributes?.action_submit_settings?.email?.from_name ?? sfbuilder_js_data?.blog_name}
                                                type="text"
                                                onChange={(newValue) => handleChangeApiSettings('email', 'from_name', newValue)}
                                                className='wpformbuilder-width-33'
                                            />
                                            <__experimentalInputControl
                                                label="Reply-To"
                                                labelPosition="edge"
                                                value={attributes?.action_submit_settings?.email?.reply_to ?? ''}
                                                type="text"
                                                onChange={(newValue) => handleChangeApiSettings('email', 'reply_to', newValue)}
                                                className='wpformbuilder-width-33'
                                            />
                                            <__experimentalInputControl
                                                label="Cc"
                                                labelPosition="edge"
                                                value={attributes?.action_submit_settings?.email?.cc}
                                                type="text"
                                                onChange={(newValue) => handleChangeApiSettings('email', 'cc', newValue)}
                                                className='wpformbuilder-width-33'
                                            />
                                            <__experimentalInputControl
                                                label="Bcc"
                                                labelPosition="edge"
                                                value={attributes?.action_submit_settings?.email?.bcc}
                                                type="text"
                                                onChange={(newValue) => handleChangeApiSettings('email', 'bcc', newValue)} // Chưa có metadata thì phải
                                                className='wpformbuilder-width-33'
                                            />
                                            <__experimentalDivider margin="2" />
                                            <FormTokenField
                                                __experimentalAutoSelectFirstMatch
                                                __experimentalExpandOnFocus
                                                __nextHasNoMarginBottom
                                                label="Meta Data"
                                                onChange={(newValues) => handleChangeApiSettings('email', 'meta_data', newValues)}
                                                suggestions={
                                                    ['Date', 'Time', 'Page URL', 'User Agent', 'Remote IP', 'Credit']
                                                }
                                                value={attributes?.action_submit_settings?.email?.meta_data ?? []}
                                                __experimentalShowHowTo={false}
                                            />
                                        </PanelBody>
                                    )}

                                    {attributes?.action_submit.includes('Mailchimp') && (
                                        <PanelBody className="wpformbuilder-action-section wpformbuilder-panel-toggle" title={<UpgradeLabel label="Mailchimp" attributes={attributes} />} opened={attributes?.state?.section === 'mailchimp'} onToggle={(toggle) => handleSetOpenSection('mailchimp', toggle)}>
                                            <SelectControl
                                                label="API Key Type"
                                                value={attributes?.action_submit_settings?.mailchimp?.type ?? 'default'}
                                                options={[
                                                    { label: 'Default', value: 'default' },
                                                    { label: 'Custom', value: 'custom' }
                                                ]}
                                                labelPosition="edge"
                                                className="wpformbuilder-heading-select"
                                                onChange={(newValue) => handleChangeApiSettings('mailchimp', 'type', newValue)}
                                            />
                                            {attributes?.action_submit_settings?.mailchimp?.type === 'custom' && (
                                                <__experimentalInputControl
                                                    label="Api Key"
                                                    labelPosition="edge"
                                                    value={attributes?.action_submit_settings?.mailchimp?.api_key_cusom}
                                                    type="text"
                                                    onChange={(newValue) => handleChangeApiSettings('mailchimp', 'api_key_cusom', newValue)}
                                                />
                                            )}
                                            {(sfbuilder_js_data?.api?.mailchimp || attributes?.action_submit_settings?.mailchimp?.api_key_cusom) && (
                                                <>
                                                    <Flex style={{ 'margin-bottom': '13px' }}>
                                                        <FlexItem>
                                                            <label>Send Confirm Email?</label>
                                                        </FlexItem>
                                                        <FlexItem className="wpformbuilder-no-margin-bootom">
                                                            <ToggleControl
                                                                __nextHasNoMarginBottom={true}
                                                                checked={attributes?.action_submit_settings?.mailchimp?.send_confirm_email ?? false}
                                                                onChange={(newValue) => handleChangeApiSettings('mailchimp', 'send_confirm_email', newValue)}
                                                            />
                                                        </FlexItem>
                                                    </Flex>
                                                    <Flex style={{ 'margin-bottom': '13px' }}>
                                                        <FlexItem>
                                                            <label>Update Contacts?</label>
                                                        </FlexItem>
                                                        <FlexItem className="wpformbuilder-no-margin-bootom">
                                                            <ToggleControl
                                                                __nextHasNoMarginBottom={true}
                                                                checked={attributes?.action_submit_settings?.mailchimp?.update_contact ?? false}
                                                                onChange={(toogle) => handleChangeApiSettings('mailchimp', 'update_contact', toogle)}
                                                            />
                                                        </FlexItem>
                                                    </Flex>
                                                    <Flex style={{ 'margin-bottom': '13px' }}>
                                                        <FlexItem>
                                                            <label>Acceptance Field?</label>
                                                        </FlexItem>
                                                        <FlexItem className="wpformbuilder-no-margin-bootom">
                                                            <ToggleControl
                                                                __nextHasNoMarginBottom={true}
                                                                checked={attributes?.action_submit_settings?.mailchimp?.acceptance_field ?? false}
                                                                onChange={(toogle) => handleChangeApiSettings('mailchimp', 'acceptance_field', toogle)}
                                                            />
                                                        </FlexItem>
                                                    </Flex>
                                                    {attributes?.action_submit_settings?.mailchimp?.list_ids && (
                                                        <>
                                                            <BaseControl label={
                                                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'space-between' }}>
                                                                    <span className='wpformbuilder-mailchimp-list-id'>List ID</span>
                                                                    <Button
                                                                        variant="primary"
                                                                        className="wpformbuilder-reload-api-data"
                                                                        style={{ width: '25px', height: '25px' }}
                                                                        title="Reload data mailchimp"
                                                                        onClick={() => handleReloadDataAPi('mailchimp')}
                                                                        icon={<FontAwesomeIcon icon={faSync} spin={spin.mailchimp} className='wpformbuilder-reset-data-mailchimp' />}
                                                                    >
                                                                    </Button>

                                                                </span>
                                                            }>
                                                                <SelectControl
                                                                    value={attributes?.action_submit_settings?.mailchimp?.list_id_selected ?? attributes?.action_submit_settings?.mailchimp?.list_ids?.[0]?.value}
                                                                    options={attributes?.action_submit_settings?.mailchimp?.list_ids ?? []}
                                                                    onChange={(val) => handleChangeListIDMailchimp(val)}
                                                                />
                                                            </BaseControl>
                                                            {attributes?.action_submit_settings?.mailchimp?.groups &&
                                                                Object.keys(attributes.action_submit_settings.mailchimp.groups).length > 0 && (
                                                                    <FormTokenField
                                                                        className={'wpformbuilder-group-mailchimp'}
                                                                        __experimentalExpandOnFocus
                                                                        __next40pxDefaultSize
                                                                        label="Groups"
                                                                        onChange={(labels) => handleChangeGroupMailchimp(labels)}
                                                                        suggestions={attributes?.action_submit_settings?.mailchimp?.groups ? Object.keys(attributes?.action_submit_settings?.mailchimp?.groups) : []}
                                                                        value={getGroupsMailchimpValue(attributes?.action_submit_settings?.mailchimp?.groups_id_selected ?? false)}
                                                                        __experimentalShowHowTo={false}
                                                                    />
                                                                )}
                                                            {(attributes?.action_submit_settings?.mailchimp?.list_id_selected && attributes?.action_submit_settings?.mailchimp?.fields) && (
                                                                <RepeaterMailchimp
                                                                    value={attributes?.action_submit_settings?.mailchimp?.mappings ?? []}
                                                                    onChange={(newVal) => handleChangeApiSettings('mailchimp', 'mappings', newVal)}
                                                                    attributes={attributes}
                                                                />
                                                            )}
                                                        </>
                                                    )}
                                                </>
                                            )}
                                            {!sfbuilder_js_data?.api?.mailchimp && attributes?.action_submit_settings?.mailchimp?.type === 'default' && (
                                                <Notice isDismissible={false} status="warning">Set your Mailchimp API credentials in the Integrations settings. You can also set a different ActiveCampaign API credentials by choosing "Custom".</Notice>
                                            )}
                                        </PanelBody>
                                    )}
                                    <PanelBody className="wpformbuilder-action-section wpformbuilder-panel-toggle" title={<UpgradeLabel label="Additional Options" attributes={attributes} />} opened={attributes?.state?.section === 'additional-options'} onToggle={(toggle) => handleSetOpenSection('additional-options', toggle)}>
                                        <__experimentalInputControl
                                            label="Success Message"
                                            labelPosition="top"
                                            value={attributes?.additional_options?.messages?.success ?? `Your submission was successful.`}
                                            type="text"
                                            onChange={(newValue) => handleChangeAdditionalOptions('messages', 'success', newValue)}
                                        />
                                        <__experimentalInputControl
                                            label="Form Error"
                                            labelPosition="top"
                                            value={attributes?.additional_options?.messages?.eror ?? `Your submission failed because of an error.`}
                                            type="text"
                                            onChange={(newValue) => handleChangeAdditionalOptions('messages', 'error', newValue)}
                                        />
                                    </PanelBody>
                                </>
                            )}
                            {attributes.state.openTab === 'style' && (
                                <>
                                    <PanelBody title={<UpgradeLabel label="Form" attributes={attributes} />} opened={attributes?.state?.section === 'form-style'} onToggle={() => handleSetOpenSection('form-style')} className={`wpformbuilder-panel-toggle`}>
                                        <Flex>
                                            <FlexItem>
                                                <LabelResponsive
                                                    label="Columns Gap"
                                                    attributes={attributes} // Xem có cần bỏ không, ko có tác dụng gì
                                                    setAttributes={setAttributes}
                                                />
                                            </FlexItem>
                                            <FlexItem>
                                                <__experimentalUnitControl
                                                    onChange={(newValue) => setFormStyle(newValue, 'column_gap', 'value')}
                                                    onUnitChange={(newValue) => setFormStyle(newValue, 'column_gap', 'unit')}
                                                    value={attributes?.style?.form?.[device]?.column_gap?.value}
                                                    unit={attributes?.style?.form?.[device]?.column_gap?.unit ?? 'px'}
                                                    min={0}
                                                    max={9999}
                                                    step={1}
                                                />
                                            </FlexItem>
                                        </Flex>
                                        <Flex>
                                            <FlexItem>
                                                <LabelResponsive
                                                    label="Rows Gap"
                                                    attributes={attributes}
                                                    setAttributes={setAttributes}
                                                />
                                            </FlexItem>
                                            <FlexItem>
                                                <__experimentalUnitControl
                                                    onChange={(newValue) => setFormStyle(newValue, 'row_gap', 'value')}
                                                    onUnitChange={(newValue) => setFormStyle(newValue, 'row_gap', 'unit')}
                                                    value={attributes?.style?.[device]?.row_gap?.value}
                                                    unit={attributes?.style?.[device]?.row_gap?.unit}
                                                    min={0}
                                                    max={9999}
                                                    step={1}
                                                />
                                            </FlexItem>
                                        </Flex>
                                        <__experimentalDivider margin="2" />
                                        <WPFormbuilderColorPicker
                                            onChange={(newColor) => setAttributes({ style: { ...attributes?.style, form: { ...attributes?.style?.form, desktop: { ...attributes?.style?.form?.desktop, 'background-color': newColor } } } })}
                                            value={attributes?.style?.form?.desktop?.['background-color']}
                                            onReset={() => setAttributes({ style: { ...attributes?.style, form: { ...attributes?.style?.form, desktop: { ...attributes?.style?.form?.desktop, 'background-color': '' } } } })}
                                            label='Background Color'
                                        />
                                        <__experimentalDivider margin="2" />
                                        <WPFrombuilderBorder attributes={attributes} setAttributes={setAttributes} property='form' />
                                        <__experimentalDivider margin="2" />
                                        <WPFrombuilderDimensions label='Radius' value={attributes?.style?.form?.desktop?.border?.radius} onChange={(newValue) => handleChangeBorderRadius(newValue, 'form')} />
                                        <__experimentalDivider margin="1" />
                                        <WPFrombuilderDimensions label='Padding' value={attributes?.style?.form?.desktop?.padding} onChange={(newValue) => handleSpacing(newValue, 'form', 'padding')} />
                                        <WPFrombuilderDimensions label='Margin' value={attributes?.style?.form?.desktop?.margin} onChange={(newValue) => handleSpacing(newValue, 'form', 'margin')} />
                                    </PanelBody>
                                    <PanelBody title={<UpgradeLabel label="Label" attributes={attributes} />} opened={attributes?.state?.section === 'label-style'} onToggle={() => handleSetOpenSection('label-style')} className={`wpformbuilder-panel-toggle`}>
                                        <WPFormbuilderColorPicker
                                            onChange={(newColor) => setAttributes({ style: { ...attributes?.style, label: { ...attributes?.style?.label, desktop: { ...attributes?.style?.label?.desktop, color: newColor } } } })} // Đang ở đây, làm onchange
                                            value={attributes?.style?.label?.desktop?.color}
                                            onReset={() => setAttributes({ style: { ...attributes?.style, label: { ...attributes?.style?.label, desktop: { ...attributes?.style?.label?.desktop, color: '' } } } })}
                                        />
                                        <__experimentalUnitControl
                                            label="Spacing"
                                            className="wpformbuilder-form-label-settings"
                                            style={{ 'margin-top': '10px' }}
                                            onChange={(newValue) =>
                                                setAttributes({
                                                    ...attributes,
                                                    style: {
                                                        ...attributes.style,
                                                        label: {
                                                            ...attributes.style.label,
                                                            desktop: {
                                                                ...attributes.style.label.desktop,
                                                                spacing: newValue
                                                            }
                                                        }
                                                    }
                                                })
                                            }
                                            value={attributes?.style?.label?.desktop?.spacing ?? ""}
                                            unit={getUnit(attributes?.style?.label?.desktop?.spacing)}
                                            min={0}
                                            max={9999}
                                            step={1}
                                        />

                                        <WPFrombuilderTypography attributes={attributes} setAttributes={setAttributes} onChange={(newValue, attrName) => handleChangeFormTypography(newValue, attrName, 'label')} device={device} property='label' />
                                    </PanelBody>
                                    <PanelBody title={<UpgradeLabel label="Field" attributes={attributes} />} opened={attributes?.state?.section === 'field-style'} onToggle={() => handleSetOpenSection('field-style')} className={`wpformbuilder-panel-toggle`}>
                                        <WPFormbuilderColorPicker
                                            onChange={(newColor) => setAttributes({ style: { ...attributes?.style, field: { ...attributes?.style?.field, desktop: { ...attributes?.style?.field?.desktop, color: newColor } } } })}
                                            value={attributes?.style?.field?.desktop?.color}
                                            onReset={() => setAttributes({ style: { ...attributes?.style, field: { ...attributes?.style?.field, desktop: { ...attributes?.style?.field?.desktop, color: '' } } } })}
                                        />
                                        <__experimentalSpacer marginTop='3'>
                                            <WPFrombuilderTypography attributes={attributes} setAttributes={setAttributes} onChange={(newValue, attrName) => handleChangeFormTypography(newValue, attrName, 'field')} device={device} property='field' />
                                        </__experimentalSpacer>
                                        <__experimentalDivider margin="2" />
                                        <WPFormbuilderColorPicker
                                            onChange={(newColor) => setAttributes({ style: { ...attributes?.style, field: { ...attributes?.style?.field, desktop: { ...attributes?.style?.field?.desktop, 'background-color': newColor } } } })}
                                            value={attributes?.style?.field?.desktop?.['background-color']}
                                            onReset={() => setAttributes({ style: { ...attributes?.style, field: { ...attributes?.style?.field, desktop: { ...attributes?.style?.field?.desktop, 'background-color': '' } } } })}
                                            label='Background Color'
                                        />
                                        <__experimentalDivider margin="2" />
                                        <WPFrombuilderBorder attributes={attributes} setAttributes={setAttributes} property='field' />
                                        <__experimentalDivider margin="2" />
                                        <WPFrombuilderDimensions label='Radius' value={attributes?.style?.field?.desktop?.border?.radius} onChange={(newValue) => handleChangeBorderRadius(newValue, 'field')} />
                                        <__experimentalDivider margin="1" />
                                        <WPFrombuilderDimensions label='Padding' value={attributes?.style?.field?.desktop?.padding} onChange={(newValue) => handleSpacing(newValue, 'field', 'padding')} />
                                        <WPFrombuilderDimensions label='Margin' value={attributes?.style?.field?.desktop?.margin} onChange={(newValue) => handleSpacing(newValue, 'field', 'margin')} />
                                    </PanelBody>
                                    <PanelBody title={<UpgradeLabel label="Button Submit" attributes={attributes} />} opened={attributes?.state?.section === 'button-submit'} onToggle={() => handleSetOpenSection('button-submit')} className={`wpformbuilder-panel-toggle`}>
                                        <Flex style={{ 'margin-bottom': '10px' }}>
                                            <FlexItem>
                                                <label>Text Align</label>
                                            </FlexItem>
                                            <FlexItem style={{ 'margin-top': '-5px' }}>
                                                <__experimentalToggleGroupControl
                                                    __nextHasNoMarginBottom
                                                    isBlock
                                                    isDeselectable={true}
                                                    onChange={(newValue) => setAttributes({ style: { ...attributes?.style, button: { ...attributes?.style?.button, desktop: { ...attributes?.style?.button?.desktop, 'text-align': newValue ?? '' } } } })}
                                                    className="wpformbuilder-button-options"
                                                    value={attributes?.style?.button?.desktop?.['text-align']}
                                                >
                                                    <__experimentalToggleGroupControlOptionIcon
                                                        icon={<Icon icon={alignLeft} size={20} />}
                                                        label="Left"
                                                        value="left"
                                                        className={`wpformbuilder-button-toggle-position-option`}
                                                    />
                                                    <__experimentalToggleGroupControlOptionIcon
                                                        icon={<Icon icon={alignCenter} size={20} />}
                                                        label="Center"
                                                        value="center"
                                                        className={`wpformbuilder-button-toggle-position-option`}
                                                    />
                                                    <__experimentalToggleGroupControlOptionIcon
                                                        icon={<Icon icon={alignRight} size={20} />}
                                                        label="Right"
                                                        value="right"
                                                        className={`wpformbuilder-button-toggle-position-option`}
                                                    />
                                                    <__experimentalToggleGroupControlOptionIcon
                                                        icon={<Icon icon={alignJustify} size={20} />}
                                                        label="Justify"
                                                        value="justify"
                                                        className={`wpformbuilder-button-toggle-position-option no-border-right`}
                                                    />
                                                </__experimentalToggleGroupControl>
                                            </FlexItem>
                                        </Flex>
                                        <Flex style={{ 'margin-bottom': '10px' }}>
                                            <FlexItem>
                                                <LabelResponsive label='Position' attributes={attributes} setAttributes={setAttributes} />
                                            </FlexItem>
                                            <FlexItem style={{ 'margin-top': '-5px' }}>
                                                <__experimentalToggleGroupControl
                                                    __nextHasNoMarginBottom
                                                    isBlock
                                                    isDeselectable={true}
                                                    onChange={(newValue) => setAttributes({ style: { ...attributes?.style, button: { ...attributes?.style?.button, [device]: { ...attributes?.style?.button?.[device], 'justify-content': newValue ?? '' } } } })}
                                                    className="wpformbuilder-button-options"
                                                    value={attributes?.style?.button?.[device]?.['justify-content']}
                                                >
                                                    <__experimentalToggleGroupControlOptionIcon
                                                        icon={<Icon icon={justifyLeft} width={18} />}
                                                        label="Left"
                                                        value="left"
                                                        className={`wpformbuilder-button-toggle-position-option`}
                                                    />
                                                    <__experimentalToggleGroupControlOptionIcon
                                                        icon={<Icon icon={justifyCenter} width={18} />}
                                                        label="Center"
                                                        value="center"
                                                        className={`wpformbuilder-button-toggle-position-option`}
                                                    />
                                                    <__experimentalToggleGroupControlOptionIcon
                                                        icon={<Icon icon={justifyRight} width={18} />}
                                                        label="Right"
                                                        value="flex-end"
                                                        className={`wpformbuilder-button-toggle-position-option`}
                                                    />
                                                    <__experimentalToggleGroupControlOptionIcon
                                                        icon={<Icon icon={justifySpaceBetween} width={18} />}
                                                        label="Stretch"
                                                        value="space-between"
                                                        className={`wpformbuilder-button-toggle-position-option no-border-right`}
                                                    />
                                                </__experimentalToggleGroupControl>
                                            </FlexItem>
                                        </Flex>
                                        <WPFrombuilderTypography attributes={attributes} setAttributes={setAttributes} onChange={(newValue, attrName) => handleChangeFormTypography(newValue, attrName, 'button')} device={device} property='button' />
                                        <WPFrombuilderBorder attributes={attributes} setAttributes={setAttributes} property='button' focusColor={false} style={{ 'margin-top': '15px' }} />
                                        <WPFrombuilderDimensions label='Radius' value={attributes?.style?.button?.desktop?.border?.radius} onChange={(newValue) => handleChangeBorderRadius(newValue, 'button')} />
                                        <__experimentalDivider margin="1" />
                                        <WPFrombuilderDimensions label='Padding' value={attributes?.style?.button?.desktop?.padding} onChange={(newValue) => handleSpacing(newValue, 'button', 'padding')} />
                                        <WPFrombuilderDimensions label='Margin' value={attributes?.style?.button?.desktop?.margin} onChange={(newValue) => handleSpacing(newValue, 'button', 'margin')} />
                                        <__experimentalDivider margin="1" />
                                        <TabPanel
                                            className="wpformbuilder-tab-panel-button-style"
                                            activeClass="active-tab"
                                            onSelect={(tabName) => setAttributes({ state: { ...attributes?.state, inRepeater: tabName } })}
                                            initialTabName={attributes?.state?.inRepeater}
                                            tabs={[
                                                {
                                                    name: 'normal',
                                                    title: 'Normal',
                                                    className: 'wpformbuilder-tab-button-normal',
                                                },
                                                {
                                                    name: 'hover',
                                                    title: 'Hover',
                                                    className: 'wpformbuilder-tab-button-hover',
                                                },
                                            ]}
                                        >
                                            {(tabs) => <div>
                                                {attributes?.state?.inRepeater == 'normal' && ( // Đang ở đây làm thuộc tính hover và normal color và bg color
                                                    <>
                                                        <WPFormbuilderColorPicker
                                                            onChange={(newColor) => setAttributes({ style: { ...attributes?.style, button: { ...attributes?.style?.button, desktop: { ...attributes?.style?.button?.desktop, color: newColor } } } })}
                                                            value={attributes?.style?.button?.desktop?.color}
                                                            onReset={() => setAttributes({ style: { ...attributes?.style, button: { ...attributes?.style?.button, desktop: { ...attributes?.style?.button?.desktop, color: '' } } } })}
                                                            label='Color'
                                                        />
                                                        <WPFormbuilderColorPicker
                                                            onChange={(newColor) => setAttributes({ style: { ...attributes?.style, button: { ...attributes?.style?.button, desktop: { ...attributes?.style?.button?.desktop, 'background-color': newColor } } } })}
                                                            value={attributes?.style?.button?.desktop?.['background-color']}
                                                            onReset={() => setAttributes({ style: { ...attributes?.style, button: { ...attributes?.style?.button, desktop: { ...attributes?.style?.button?.desktop, 'background-color': '' } } } })}
                                                            label='Background Color'
                                                        />
                                                    </>
                                                )}
                                                {attributes?.state?.inRepeater == 'hover' && (
                                                    <>
                                                        <WPFormbuilderColorPicker
                                                            onChange={(newColor) => setAttributes({ style: { ...attributes?.style, button: { ...attributes?.style?.button, desktop: { ...attributes?.style?.button?.desktop, hoverColor: newColor } } } })}
                                                            value={attributes?.style?.button?.desktop?.hoverColor}
                                                            onReset={() => setAttributes({ style: { ...attributes?.style, button: { ...attributes?.style?.button, desktop: { ...attributes?.style?.button?.desktop, hoverColor: '' } } } })}
                                                            label='Color'
                                                        />
                                                        <WPFormbuilderColorPicker
                                                            onChange={(newColor) => setAttributes({ style: { ...attributes?.style, button: { ...attributes?.style?.button, desktop: { ...attributes?.style?.button?.desktop, backgroundHoverColor: newColor } } } })}
                                                            value={attributes?.style?.button?.desktop?.backgroundHoverColor}
                                                            onReset={() => setAttributes({ style: { ...attributes?.style, button: { ...attributes?.style?.button, desktop: { ...attributes?.style?.button?.desktop, backgroundHoverColor: '' } } } })}
                                                            label='Background Color'
                                                        />
                                                    </>
                                                )}
                                            </div>}
                                        </TabPanel>
                                    </PanelBody>
                                    <PanelBody title={<UpgradeLabel label="Custom CSS" attributes={attributes} />} opened={attributes?.state?.section === 'custom-css'} onToggle={() => handleSetOpenSection('custom-css')} className={`wpformbuilder-panel-toggle`}>
                                        <CssCustom
                                            attributes={attributes}
                                            setAttributes={setAttributes}
                                        />
                                    </PanelBody>
                                </>
                            )}
                        </div>
                        }
                    </TabPanel>
                </InspectorControls>
                <div {...attributeForm}>
                    <div className='wpformbuilder-form__inner'>
                        {attributes?.fields.map((item, index) => {
                            item = { ...item, ...attributes?.form }
                            switch (item.type) {
                                case 'text':
                                    return <WPformbuilderTextControl attributes={item} key={index} device={device} style={attributes?.style} />
                                case 'number':
                                    return <WPformbuilderNumberControl attributes={item} key={index} device={device} style={attributes?.style} />;
                                case 'email':
                                    return <WPformbuilderEmailControl attributes={item} key={index} device={device} style={attributes?.style} />;
                                case 'tel':
                                    return <WPformbuilderTelControl attributes={item} key={index} device={device} style={attributes?.style} />;
                                case 'url':
                                    return <WPformbuilderURLControl attributes={item} key={index} device={device} style={attributes?.style} />;
                                case 'textarea':
                                    return <WPformbuilderTextareaControl attributes={item} key={index} device={device} style={attributes?.style} />;
                                case 'password':
                                    return <WPformbuilderPasswordControl attributes={item} key={index} device={device} style={attributes?.style} />;
                                case 'hidden':
                                    return <WPformbuilderHiddenControl attributes={item} key={index} device={device} style={attributes?.style} />;
                                case 'select':
                                    return <WPformbuilderSelectControl attributes={item} key={index} device={device} style={attributes?.style} />;
                                case 'checkbox':
                                    return <WPformbuilderCheckboxControl attributes={item} key={index} device={device} style={attributes?.style} />;
                                case 'radio':
                                    return <WPformbuilderRadioControl attributes={item} key={index} device={device} style={attributes?.style} />;
                            }
                        })}
                    </div>
                    <div className='wpformbuilder-form__button'>
                        <button className={`wpformbuilder-form__button--submit wpformbuilder-button-submit-${attributes?.button?.size}`}>
                            <span className='wpformbuilder-form__button--submit__content'>
                                {attributes?.button?.icon?.type !== 'none' && attributes?.button?.icon?.position === 'left' && (
                                    <>
                                        {attributes?.button?.icon?.type === 'icon_lib' && (
                                            <span className='wpformbuilder-submit-button-icon' style={{ marginRight: `${attributes?.button?.icon?.spacing ?? '10px'}` }}><i className={`fa-${attributes?.button?.icon.group} fa-${attributes?.button?.icon.name}`} /></span>
                                        )}
                                        {attributes?.button?.icon?.type === 'upload' && (
                                            <span className='wpformbuilder-submit-button-icon' style={{ marginRight: `${attributes?.button?.icon?.spacing ?? '10px'}` }}><img src={attributes?.button?.icon.url} /></span>
                                        )}
                                    </>
                                )}
                                <span className='wpformbuilder-submit-button-text'>{attributes?.button?.name || 'Submit'}</span>
                                {attributes?.button?.icon?.type !== 'none' && attributes?.button?.icon?.position !== 'left' && (
                                    <>
                                        {attributes?.button?.icon?.type === 'icon_lib' && (
                                            <span className='wpformbuilder-submit-button-icon' style={{ marginLeft: `${attributes?.button?.icon?.spacing ?? '10px'}` }}><i className={`fa-${attributes?.button?.icon.group} fa-${attributes?.button?.icon.name}`} /></span>
                                        )}
                                        {attributes?.button?.icon?.type === 'upload' && (
                                            <span className='wpformbuilder-submit-button-icon' style={{ marginLeft: `${attributes?.button?.icon?.spacing ?? '10px'}` }}><img src={attributes?.button?.icon.url} /></span>
                                        )}
                                    </>
                                )}
                            </span>
                        </button>
                    </div>
                </div>
                {css && (
                    <style type="text/css">{css}</style>
                )}
            </>
        )
    },
});