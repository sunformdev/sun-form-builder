import { default as minifyCssString } from 'minify-css-string'
import { attributes } from '../includes//attributes';
import { color, desktop, mobile } from '@wordpress/icons';

const { useState, useEffect, useRef } = wp.element;
const { useSelect } = wp.data;

const generateFormCSS = (attributes) => {
    //console.log("cssForm: ", cssForm);
    const devices = ['desktop', 'tablet', 'mobile'];
    const formStyle = attributes?.style ?? [];
    let cssOjb = {
        desktop: '',
        tablet: '',
        mobile: ''
    };
    let cssGap = {
        desktop: '',
        tablet: '',
        mobile: ''
    }
    let cssString = '';
    let css_custom = '';
    for (const device of devices) {
        let cssAttributes = formStyle?.form?.[device] ?? {};
        let unit = 'px', value = '';
        Object.entries(cssAttributes).map(([key, item]) => {
            let cssName = key.replace(/_/g, "-");
            switch (key) {
                case 'column_gap':
                case 'row_gap':
                    value = item?.value ?? false;
                    cssGap[device] += value ? `${cssName}:${value};` : '';
                    break;
                case 'padding':
                case 'margin':
                    cssOjb[device] += getSpacingCSS(item, key);
                    break;
                case 'border':
                    const borderCSS = getBorderStyle(item);
                    cssOjb[device] += borderCSS?.borderCss;
                    if (borderCSS?.hoverColor && borderCSS?.hoverColor !== '') {
                        cssHover += `${buttonClass}:hover{border-color: ${borderCSS.hoverColor}}`;
                    }
                    if (borderCSS?.focusColor && borderCSS?.focusColor !== '') {
                        cssHover += `${buttonClass}:focus{border-color: ${borderCSS.focusColor}}`;
                    }
                    break;
                case 'css_custom':
                    css_custom = minifyCssString(item).replace('%root%', `.wpformbuilder-form-${attributes?.form?.id}`);
                    if (isValidCssRule(css_custom)) {
                        console.log('item: ', item);
                    }
                    break;
                default:
                    cssOjb[device] += value ? `${key}:${item};` : '';
            }
        });
    }
    // For Column Gap and Row Gap
    if (cssGap.desktop !== '') {
        cssString += `.wpformbuilder-form-${attributes?.form?.id} .wpformbuilder-form__inner{${cssGap.desktop}}`;
    }
    if (cssGap.tablet !== '') {
        cssString += `@media screen and (max-width: 780px) {.wpformbuilder-form-${attributes?.form?.id} .wpformbuilder-form__inner{${cssGap.tablet}}}`;
    }
    if (cssGap.mobile !== '') {
        cssString += `@media screen and (max-width: 360px) {.wpformbuilder-form-${attributes?.form?.id} .wpformbuilder-form__inner{${cssGap.mobile}}}`;
    }
    // For common
    if (cssOjb.desktop !== '') {
        cssString += `.wpformbuilder-form-${attributes?.form?.id}{${cssOjb.desktop}}`;
    }
    if (cssOjb.tablet !== '') {
        cssString += `@media screen and (max-width: 780px) {.wpformbuilder-form-${attributes?.form?.id}{${cssOjb.tablet}}}`;
    }
    if (cssOjb.mobile !== '') {
        cssString += `@media screen and (max-width: 360px) {.wpformbuilder-form-${attributes?.form?.id}{${cssOjb.mobile}}}`;
    }
    return minifyCssString(css_custom + cssString);
}

const generateLabelCSS = (attributes) => {
    const devices = ['desktop', 'tablet', 'mobile'];
    const labelClass = `.wpformbuilder-form-${attributes?.form?.id} .wpformbuilder-form__inner .wpformbuilder-form-group label`;
    const formStyle = attributes?.style ?? [];
    let cssOjb = {
        desktop: '',
        tablet: '',
        mobile: ''
    };
    let cssString = '';
    for (const device of devices) {
        let cssAttributes = formStyle?.label?.[device] ?? {};
        let unit = 'px', value = '';
        Object.entries(cssAttributes).map(([key, item]) => {
            if (key === 'spacing') {
                key = 'margin-bottom';
            }
            value = item ?? false;
            cssOjb[device] += value ? `${key}:${item};` : '';
        });
    }
    if (cssOjb.desktop !== '') {
        cssString += `${labelClass}{${cssOjb.desktop}}`;
    }
    if (cssOjb.tablet !== '') {
        cssString += `@media screen and (max-width: 780px) {${labelClass}{${cssOjb.tablet}}}`;
    }
    if (cssOjb.mobile !== '') {
        cssString += `@media screen and (max-width: 360px) {${labelClass}{${cssOjb.mobile}}}`;
    }
    return cssString;
}

const generateButtonCSS = (attributes) => {
    const devices = ['desktop', 'tablet', 'mobile'];
    const buttonBoxClass = `.wpformbuilder-form-${attributes?.form?.id} .wpformbuilder-form__button`;
    const buttonClass = `.wpformbuilder-form-${attributes?.form?.id} .wpformbuilder-form__button .wpformbuilder-form__button--submit`;
    const formStyle = attributes?.style ?? [];
    let cssButtonBox = { desktop: '', tablet: '', mobile: '' };
    let cssHoverColor = '';
    let cssOjb = {
        desktop: '',
        tablet: '',
        mobile: ''
    };
    let cssString = '', cssHover = '';
    for (const device of devices) {
        let cssAttributes = formStyle?.button?.[device] ?? {};
        let unit = 'px', value = '';
        Object.entries(cssAttributes).map(([key, item]) => {
            value = item ?? false;
            if (value) {
                switch (key) {
                    case 'border':
                        const borderCSS = getBorderStyle(item);
                        cssOjb[device] += borderCSS?.borderCss;
                        if (borderCSS?.hoverColor && borderCSS?.hoverColor !== '') {
                            cssHover += `${buttonClass}:hover{border-color: ${borderCSS.hoverColor}}`;
                        }
                        if (borderCSS?.focusColor && borderCSS?.focusColor !== '') {
                            cssHover += `${buttonClass}:focus{border-color: ${borderCSS.focusColor}}`;
                        }
                        break;
                    case 'hoverColor':
                        cssHoverColor += value ? `color:${item};` : '';
                        break;
                    case 'backgroundHoverColor':
                        cssHoverColor += value ? `background-color:${item};` : '';
                        break;
                    case 'padding':
                    case 'margin':
                        cssOjb[device] += getSpacingCSS(item, key);
                        break;
                    case 'justify-content':
                        cssButtonBox[device] += value ? `${key}:${item};` : '';
                        break;
                    default:
                        cssOjb[device] += value ? `${key}:${item};` : '';
                }
            }

        });
    }
    if (cssHoverColor !== '') {
        cssHoverColor = `${buttonClass}:hover{${cssHoverColor}}`;
    }
    // For button
    if (cssOjb.desktop !== '' || cssButtonBox.desktop !== '') {
        cssString += cssOjb.desktop !== '' ? `${buttonClass}{${cssOjb.desktop}}` : '';
        cssString += cssButtonBox.desktop !== '' ? `${buttonBoxClass}{${cssButtonBox.desktop}}` : '';
    }
    if (cssOjb.tablet !== '' || cssButtonBox.tablet !== '') {
        cssString += `@media screen and (max-width: 780px) {`;
        cssString += cssOjb.tablet !== '' ? `${buttonClass}{${cssOjb.tablet}}` : '';
        cssString += cssButtonBox.tablet !== '' ? `${buttonBoxClass}{${cssButtonBox.tablet}}` : '';
        cssString += `}`;
    }
    if (cssOjb.mobile !== '' || cssButtonBox.mobile !== '') {
        cssString += `@media screen and (max-width: 360px) {`;
        cssString += cssOjb.mobile !== '' ? `${buttonClass}{${cssOjb.mobile}}` : '';
        cssString += cssButtonBox.mobile !== '' ? `${buttonClass}{${cssButtonBox.mobile}}` : '';
        cssString += `}`;
    }
    return minifyCssString(cssString + cssHover + cssHoverColor);
}

const generateFieldCSS = (attributes) => {
    const devices = ['desktop', 'tablet', 'mobile'];
    const fieldClass = `.wpformbuilder-form-${attributes?.form?.id} .wpformbuilder-form__inner .wpformbuilder-form-group .wpformbuilder-form-control__field`;
    const formStyle = attributes?.style ?? [];
    let cssOjb = {
        desktop: '',
        tablet: '',
        mobile: ''
    };
    let cssString = '', cssHover = '';
    for (const device of devices) {
        let cssAttributes = formStyle?.field?.[device] ?? {};
        let unit = 'px', value = '';
        Object.entries(cssAttributes).map(([key, item]) => {
            value = item ?? false;
            switch (key) {
                case 'padding':
                case 'margin':
                    cssOjb[device] += getSpacingCSS(item, key);
                    break;
                case 'border':
                    const borderCSS = getBorderStyle(item);
                    cssOjb[device] += borderCSS?.borderCss;
                    if (borderCSS?.hoverColor && borderCSS?.hoverColor !== '') {
                        cssHover += `${fieldClass}:hover{border-color: ${borderCSS.hoverColor}}`;
                    }
                    if (borderCSS?.focusColor && borderCSS?.focusColor !== '') {
                        cssHover += `${fieldClass}:focus{border-color: ${borderCSS.focusColor}}`;
                    }
                    break;
                default:
                    cssOjb[device] += value ? `${key}:${item};` : '';
            }
        });
    }
    if (cssOjb.desktop !== '') {
        cssString += `${fieldClass}{${cssOjb.desktop}}`;
    }
    if (cssOjb.tablet !== '') {
        cssString += `@media screen and (max-width: 780px) {${fieldClass}{${cssOjb.tablet}}}`;
    }
    if (cssOjb.mobile !== '') {
        cssString += `@media screen and (max-width: 360px) {${fieldClass}{${cssOjb.mobile}}}`;
    }
    return minifyCssString(cssString + cssHover);
}

const generateColumnCSS = (attributes) => {
    let cssColumn = {
        desktop: '',
        tablet: '',
        mobile: ''
    };
    let cssString = '';
    let fields = attributes?.fields ?? [];
    for (const field of fields) {
        let columnClass = `.wpformbuilder-form-${attributes?.form?.id} .wpformbuilder-form-group.${field?.id}`;
        for (const device of ['desktop', 'tablet', 'mobile']) {
            switch (device) {
                case 'mobile':
                    cssColumn['mobile'] += `${columnClass}{width:${getColumnWidth(field, device, attributes?.style)};}`;
                    break
                case 'tablet':
                    cssColumn['tablet'] += `${columnClass}{width:${getColumnWidth(field, device, attributes?.style)};}`;
                    break;
                default:
                    cssColumn['desktop'] += `${columnClass}{width:${getColumnWidth(field, device, attributes?.style)};}`;
            }
        }
    }
    if (cssColumn?.desktop !== '') {
        cssString += cssColumn?.desktop;
    }
    if (cssColumn?.tablet !== '') {
        cssString += `@media screen and (max-width: 780px) {${cssColumn?.tablet}}`;
    }
    if (cssColumn?.mobile !== '') {
        cssString += `@media screen and (max-width: 360px) {${cssColumn?.mobile}}`;
    }
    return cssString;
}

const getColumnWidth = (attributes, device, style) => {
    let width;
    if (['default', '100%'].includes(attributes?.column_width?.[device])) {
        width = `100%`;
    } else {
        let columns_gap = style?.form?.[device]?.column_gap?.value ?? 10;
        let columns_unit = style?.form?.[device]?.column_gap?.unit ?? 'px';
        let calc = Number.parseFloat(parseFloat(columns_gap) / 2).toFixed(1);
        width = `calc(${attributes?.column_width?.[device]} - ${calc}${columns_unit})`;
    }

    return width;
};

function getBorderStyle(border) {
    let borderCss = '';

    const width = border.width;
    const widthUnit = border.width?.unit ? border?.width?.unit : 'px';

    const radius = border.radius;
    const radiusUnit = border.radius?.unit ? border?.radius?.unit : 'px';

    const style = border.type;
    const color = border.color;
    const hoverColor = border.hoverColor ?? '';
    const focusColor = border.focusColor ?? '';

    if (style && style != 'none' && typeof (style) != 'undefined') {
        if (width) {
            borderCss += `
            ${addCSSProperty('border-style', style, '')}
            ${addCSSProperty('border-color', color, '')}
            ${addCSSProperty('border-top-width', width.top, widthUnit)}
            ${addCSSProperty('border-right-width', width.right, widthUnit)}
            ${addCSSProperty('border-bottom-width', width.bottom, widthUnit)}
            ${addCSSProperty('border-left-width', width.left, widthUnit)}`;
        }
    }

    if (radius) {
        borderCss += `
        ${addCSSProperty('border-top-left-radius', radius.top, radiusUnit)}
        ${addCSSProperty('border-top-right-radius', radius.right, radiusUnit)}
        ${addCSSProperty('border-bottom-right-radius', radius.bottom, radiusUnit)}
        ${addCSSProperty('border-bottom-left-radius', radius.left, radiusUnit)}`;
    }

    return {
        borderCss: minifyCssString(borderCss),
        hoverColor: hoverColor,
        focusColor: focusColor
    };
}

const getSpacingCSS = (spacing, name) => {
    //console.log('spacing, name: ', spacing, name);
    let spacingCSS = '';
    let spacingUnit = (spacing?.unit && spacing?.unit !== '') ? spacing?.unit : 'px';
    if (spacing) {
        spacingCSS += `
        ${addCSSProperty(name + '-top', spacing.top, spacingUnit)}
        ${addCSSProperty(name + '-right', spacing.right, spacingUnit)}
        ${addCSSProperty(name + '-bottom', spacing.bottom, spacingUnit)}
        ${addCSSProperty(name + '-left', spacing.left, spacingUnit)};`;
    }
    return minifyCssString(spacingCSS);
}

function addCSSProperty(property, value, unit) {
    if (value !== '' && typeof (value) != 'undefined') {
        return `${property}: ${value}${unit}; `;
    }
    return '';
}
//Save css file
wp.domReady(function () {
    let lastIsSaving = false;
    let lastIsAutosaving = false;

    wp.data.subscribe(() => {
        let css = '';

        const currentEditor = wp.data.select('core/editor');
        const currentPostId = currentEditor.getCurrentPostId();
        const isSavingPost = currentEditor.isSavingPost();
        const isAutosavingPost = currentEditor.isAutosavingPost();
        const isEditedPostDirty = currentEditor.isEditedPostDirty();
        //console.log('isEditedPostDirty', isEditedPostDirty);
        //if (isSavingPost && !isAutosavingPost) {
        if (isSavingPost && !lastIsSaving && !isAutosavingPost) {
            // ajaxCalled = true;
            const blocks = currentEditor.getBlocks();
            //console.log('sun_data: ', blocks); // Đang ở đây làm tải css vs js nữa
            blocks.forEach(block => {
                if (block.name.includes('sunformbuilder/form')) {
                    // console.log('block===> ', block);
                    css += getCssBlock(block);
                }
            });
            // console.log('sun_js_data---------->', sun_js_data);
            if (css) {
                const data = new FormData();
                data.append('action', 'sunform_save_css');
                data.append('css', css);
                data.append('nonce', sun_js_data.nonce);
                data.append('post_id', currentPostId);
                fetch(sun_data.ajaxurl, {
                    method: 'POST',
                    body: data,
                })
                    .then(() => {
                        setTimeout(() => {
                            // ajaxCalled = false
                        }, 1000)
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        setTimeout(() => {
                            // ajaxCalled = false
                        }, 1000)
                    });
            }
        }

        lastIsSaving = isSavingPost;
        lastIsAutosaving = isAutosavingPost;
    });

    function getCssBlock(block) {
        let attributes = block?.attributes;
        let cssBlock = attributes?.css?.editor ?? '';
        //let cssCustomString = '';

        // cssCustomString = getCssCustomBlock(attributes);
        // cssBlock = cssBlock + cssCustomString;

        if (block?.innerBlocks && block?.innerBlocks.length) {
            block?.innerBlocks.forEach(newBlock => {
                cssBlock += getCssBlock(newBlock)
            });
        }
        return minifyCssString(cssBlock);
    }
});
const createResponsiveStyle = (style) => {
    return {
        desktop: { ...style },
        tablet: { ...style },
        mobile: { ...style }
    };
}
const getUnit = (string) => {
    if (typeof string === 'undefined') {
        return '';
    }
    const match = string.match(/[a-zA-Z%]+$/);
    return match ? match[0] : 'px';
}
function isValidCssRule(rule) {
    const style = document.createElement('style');
    document.head.appendChild(style);

    const sheet = style.sheet;
    try {
        sheet.insertRule(rule, sheet.cssRules.length);
        document.head.removeChild(style);
        return true;
    } catch (e) {
        document.head.removeChild(style);
        return false;
    }
}
export { generateFormCSS, createResponsiveStyle, getColumnWidth, getUnit, generateLabelCSS, generateFieldCSS, generateButtonCSS, generateColumnCSS }