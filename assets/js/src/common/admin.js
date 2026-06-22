import { html as beautifyHtml } from 'js-beautify';

jQuery(function ($) {
    // Settings Page
    var page = getUrlParameter('page');
    if(page === 'sun_settings'){
        var tab_setting_active = localStorage.getItem("wpformbuilder_setting_tab_active");
        if(tab_setting_active){
            $('[data-tab="'+tab_setting_active+'"]').closest('li').addClass('active');
            $('[data-tab-item="'+tab_setting_active+'"]').addClass('active');
        }else{
            $('[data-tab="widget"]').closest('li').addClass('active');
            $('[data-tab-item="widget"]').addClass('active');
        }
        $(document).on('click', '.wpformbuilder-admin-tab-heading li', function(){
            let $el = $(this).closest('.wpformbuilder-admin-tab-container');
            $el.find('ul li').removeClass('active');
            var tab_name = $(this).find('a').eq(0).attr('data-tab');
            $(this).addClass('active');
            $el.find('[data-tab-item]').removeClass('active');
            $el.find('[data-tab-item="'+tab_name+'"]').eq(0).addClass('active');
            localStorage.setItem("wpformbuilder_setting_tab_active", tab_name);
        });
    }else{
        localStorage.removeItem("wpformbuilder_setting_tab_active");
    }

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
    
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
    
            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };
    // Save options
    $('.wpformbuilder-api-save').on('click', async function() {
        let that = $(this);
        let hasPreview = $(this).hasClass('has-preview');
        $(this).find('img').addClass('loading');
        let tdElement = $(this).closest('td');
        let name = $(this).data('name');
        let value = tdElement.find('[name="'+name+'"]').val();
        let apiData = {
            action: 'sunform_save_options',
            nonce: sfbuilder_js_data.nonce,
            data: {
                name: name,
                value: value
            }
        }
        $.post(sfbuilder_js_data.ajaxurl, apiData, function(response){
            that.find('img').removeClass('loading');
            if(hasPreview){
                that.hide();
                tdElement.find('.wpformbuilder-api-change').show();
                tdElement.find('.wpformbuilder-api-cancel').hide();
            }
            tdElement.find('.wpformbuilder-notification-save-settings').css('display', 'inline');
            setTimeout(() => {
                tdElement.find('.wpformbuilder-notification-save-settings').fadeOut()
            }, 6000);
        });
    });

    $(document).on('click', '.wpformbuilder-api-change', function(){
        $(this).hide();
        let tabTD = $(this).closest('td');
        tabTD.find('.wpformbuilder-api-save').show();
        let apiName = $(this).data('name');
        tabTD.find('.wpformbuilder-preview-key').hide();
        tabTD.find('input.wpformbuilder-hidden-key')[0].setAttribute('type', 'text');
        tabTD.find('.wpformbuilder-api-cancel').show();
    });

    $(document).on('click', '.wpformbuilder-api-cancel', function(){
        $(this).hide();
        let tabTD = $(this).closest('td');
        tabTD.find('.wpformbuilder-preview-key').show();
        tabTD.find('.wpformbuilder-api-save').hide();
        tabTD.find('.wpformbuilder-api-change').show();
        let oldValue = tabTD.find('.wpformbuilder-preview-key').data('value');
        tabTD.find('input.wpformbuilder-hidden-key')[0].setAttribute('type', 'hidden');
    });
    //API Status show/hidden
    $.each(['api', 'payment'], (index, name) => {
        let parent = $('[data-tab-item="'+name+'-setting"]');
        let apiListElements = parent.find('[data-api-name]');
        let apiStatus = localStorage.getItem('wpformbuilder_plugin_'+name+'_status');
        if(apiStatus !== null){
            apiStatus = JSON.parse(apiStatus);
            $.each(apiStatus, function(key, val){
                if(val){
                    $('input#'+key).prop('checked', true);
                    $('[data-api-name="'+key+'"]').show();
                }else{
                    $('[data-api-name="'+key+'"]').hide();
                    $('input#'+key).prop('checked', false);
                }
            });
        }else{
            let newApiStatus = {}
            $.each(apiListElements, (index, item) => {
                let name = $(item).data('api-name');
                newApiStatus[name] = true;
            });
            localStorage.setItem('wpformbuilder_plugin_'+name+'_status', JSON.stringify(newApiStatus));   
            $('input[name="api_name"]').prop('checked', true);
        }
    });
    //Item input settings click
    $('.wpformbuilder-admin-api-input-item').on('click', function(){
        let tab = $(this).closest('[data-tab-item]').data('tab-item');
        let tabName = tab.split('-')[0];
        let apiName = $(this).val();
        let apiElement = $('[data-api-name="'+apiName+'"]');
        let api_stauts = localStorage.getItem('wpformbuilder_plugin_'+tabName+'_status');
        let checked = true, newStatus = {};
        api_stauts = api_stauts !== null ? JSON.parse(api_stauts) : {}
        if($(this).is(":checked")){
            apiElement.fadeIn();
            api_stauts[apiName] = true;
        }else{
            apiElement.fadeOut();
            checked = false;
            api_stauts[apiName] = false;
        }
        localStorage.setItem('wpformbuilder_plugin_'+tabName+'_status', JSON.stringify(api_stauts));     
    });
    //Check all and uncheck all api
    $('.wpformbuilder-admin-control-api__button').on('click', function() {
        let parent = $(this).closest('[data-tab-item]');
        let tab = parent.data('tab-item');
        console.log('tab: ', tab);
        let tabName = tab.split('-')[0];
        let is_checked = $(this).hasClass('check') ? true : false;
        if(is_checked){
            parent.find('input.wpformbuilder-admin-api-input-item').not(':disabled').prop('checked', true);
            s_set_api_status(true, tabName, parent)
        }else{
            parent.find('input.wpformbuilder-admin-api-input-item').not(':disabled').prop('checked', false);
            s_set_api_status(false, tabName, parent)
        }
    });
    function s_set_api_status(status, tabName, parent){
        let apiSatus = localStorage.getItem('wpformbuilder_plugin_'+tabName+'_status');
        if(apiSatus !== null){
            let newStatus = JSON.parse(apiSatus)
            $.each(newStatus, function(key, value){
                newStatus[key] = status;
                console.log(parent.find('[data-api-name="'+key+'"]'));
                if(status){
                    
                    parent.find('[data-api-name="'+key+'"]').fadeIn();
                }else{
                    parent.find('[data-api-name="'+key+'"]').fadeOut();
                }
            });
            localStorage.setItem('wpformbuilder_plugin_'+tabName+'_status', JSON.stringify(newStatus));
        }
    }

    // Email Teamplate codeEditor
    let emailMetabox = document.querySelector('#sunformbuilder-email-editor');

    if (emailMetabox) {
        let editor = wp.codeEditor.initialize(emailMetabox, {
            mode: 'htmlmixed',
            indentUnit: 4,
            tabSize: 4,
            lineNumbers: true,
            autoCloseTags: true,
            matchBrackets: true,
            styleActiveLine: true,
            extraKeys: {
                "Ctrl-Space": "autocomplete",
                "Ctrl-Shift-F": function (cm) { formatHTML(editor.codemirror); }
            }
        });
        editor.codemirror.setSize("100%", "400px");
        setTimeout(() => {
            formatHTML(editor.codemirror);
        }, 500);
    }

    function formatHTML(cm) {
        if (!cm) {
            console.error("Editor chưa được khởi tạo!");
            return;
        }
    
        let rawHTML = cm.getValue();
    
        // 🔹 Tạm thay thế các thẻ Twig để tránh bị phá format
        let twigMarkers = [];
        let htmlWithPlaceholders = rawHTML.replace(/\{\{.*?\}\}|\{%.*?%\}/g, (match) => {
            let placeholder = `TWIG_PLACEHOLDER_${twigMarkers.length}`;
            twigMarkers.push(match);
            return placeholder;
        });
    
        // 🔹 Format HTML bình thường
        let formattedHTML = beautifyHtml(htmlWithPlaceholders, {
            indent_size: 4,
            indent_char: " ",
            preserve_newlines: true
        });
    
        // 🔹 Khôi phục lại các thẻ Twig ban đầu
        twigMarkers.forEach((originalTwig, index) => {
            formattedHTML = formattedHTML.replace(`TWIG_PLACEHOLDER_${index}`, originalTwig);
        });
    
        // 🔹 Thêm xử lý định dạng cho Twig tags
        formattedHTML = formatHtmlWithTwigBlocksOnly(formattedHTML);
    
        cm.setValue(formattedHTML);
    }
    
    function formatHtmlWithTwigBlocksOnly(rawHTML) {
        const indentChar = '    ';
        let indentLevel = 0;
    
        const openingTwigTags = ['if', 'for', 'block', 'macro', 'embed', 'filter', 'spaceless', 'verbatim', 'raw'];
        const closingTwigTags = ['endif', 'endfor', 'endblock', 'endmacro', 'endembed', 'endfilter', 'endspaceless', 'endverbatim', 'endraw'];
        const middleTwigTags = ['else', 'elseif', 'empty'];
    
        function isOpeningHtmlTag(line) {
            return /^<([a-zA-Z0-9\-]+)(\s[^>]*)?>$/.test(line.trim());
        }
    
        function isClosingHtmlTag(line) {
            return /^<\/([a-zA-Z0-9\-]+)>$/.test(line.trim());
        }
    
        function isSelfClosingHtmlTag(line) {
            return /\/>$/.test(line.trim());
        }
    
        function isOpeningTwigTag(line) {
            return openingTwigTags.some(tag => line.trim().startsWith(`{% ${tag}`));
        }
    
        function isClosingTwigTag(line) {
            return closingTwigTags.some(tag => line.trim().startsWith(`{% ${tag}`));
        }
    
        function isMiddleTwigTag(line) {
            return middleTwigTags.some(tag => line.trim().startsWith(`{% ${tag}`));
        }
    
        function splitByTwigBlocks(str) {
            // Chỉ tách các {% ... %}, giữ nguyên {{ ... }} hay {{{ ... }}}
            return str
                .replace(/(\{%.*?%\})/g, '\n$1\n') // Tách {% ... %}
                .replace(/>\s*</g, '>\n<')         // Tách thẻ HTML liền nhau
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0);
        }
    
        const lines = splitByTwigBlocks(rawHTML);
    
        return lines.map(line => {
            // Twig đóng hoặc thẻ đóng HTML
            if (isClosingHtmlTag(line) || isClosingTwigTag(line) || isMiddleTwigTag(line)) {
                indentLevel = Math.max(indentLevel - 1, 0);
            }
    
            const indentedLine = indentChar.repeat(indentLevel) + line;
    
            // Twig mở hoặc thẻ HTML mở (không tự đóng)
            if ((isOpeningHtmlTag(line) && !isSelfClosingHtmlTag(line)) || isOpeningTwigTag(line) || isMiddleTwigTag(line)) {
                indentLevel++;
            }
    
            return indentedLine;
        }).join('\n');
    }
    
});
