// (function ($) {
jQuery(document).ready(function ($) {
    $('form.wpformbuilder-box-form').on('submit', function (e) {
        e.preventDefault();
        const formElement = $(this) // Chú ý ở đây formElement là thằng thẻ form
        const formWrapper = $(this).closest('.wpformbuilder-form');
        const overlay = formWrapper.find('.wpformbuilder-overlay');
        overlay.prop('hidden', false);

        const formData = new FormData(this);
        const formID = $(this).data('form-id');
        const post_form_id = $(this).data('post-form');

        formData.append('action', 'sun_submit_from');
        formData.append('formID', formID);
        formData.append('post_form_id', post_form_id);
        // formData.append('field_attribute', JSON.stringify(fieldAttributes));
        formData.append('nonce', sfbuilder_js_data.nonce);
        jQuery.ajax({
            url: sfbuilder_js_data.ajaxurl,
            type: 'POST',  // Phương thức POST
            data: formData,  // Dữ liệu gửi đi
            dataType: "json",
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                // Xử lý khi nhận được phản hồi từ server
                console.log(response);  // In phản hồi từ server (có thể là thông báo thành công, lỗi...)
                formElement.find('.wpformbuilder-message__submit').addClass(response.status).text(response.msg).fadeIn();
                formElement[0].reset();

                setTimeout (() => {
                    formElement.find('.wpformbuilder-message__submit').fadeOut();
                }, 5000)
                overlay.prop('hidden', true);
                // Hiển thị thông báo thành công
                //$('#responseMessage').html('<p>Form submitted successfully!</p>');
            },
            error: function (xhr, status, error) {
                // Xử lý khi có lỗi xảy ra trong quá trình gửi dữ liệu
                console.error('Error: ' + error);  // In lỗi ra console
                overlay.prop('hidden', true);
                // Hiển thị thông báo lỗi
                //$('#responseMessage').html('<p>There was an error submitting the form.</p>');
            }
        });

        //console.log('formData.entries(): ', formData.entries());
        // for (const [name, value] of formData.entries()) {
        //     console.log(`${name}: ${value}`);
        // }
    });
});
// })(jQuery);