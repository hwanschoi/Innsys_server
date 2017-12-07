document.write('<script src="/plugin/tinymce_js/tinymce.min.js"></script>');

// tinymce.init({
//     selector: "textarea#id_reply_textarea",
//     theme: "modern",
//     language: "ko_KR",
//     // content_css: "css/development.css",
//     add_unload_trigger: false,
//     autosave_ask_before_unload: false,

//     toolbar1: "bold italic underline strikethrough | alignleft aligncenter alignright | undo redo",
//     menubar: false,
//     toolbar_items_size: 'small',
//     resize: false,
//     statusbar: false,
// });

var getTextarea = function () {
    //참고 comment-box
    //var data = '<textarea id="id_reply_textarea" name="id_reply_textarea" rows="5" cols="80" style="width: 680px"></textarea>';
    var data = '<div class="input-group">';
    data += '<textarea id="id_text_reply" class="form-control" rows="5" cols="" style="resize: none"></textarea>';
    data += '<span id="id_btn_reply" class="input-group-addon btn btn-primary">Send</span>';
    data += '</div>';

    return data;
}