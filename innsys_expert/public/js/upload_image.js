function fileCheck(obj) {
    pathPoint = obj.value.lastIndexOf('.');
    filePoint = obj.value.substring(pathPoint + 1, obj.length);
    fileType = filePoint.toLowerCase();
    if (fileType == 'jpg' || fileType == 'png' || fileType == 'jpeg' || fileType == 'bmp') {
        //정상이미지
    } else {
        alert('이미지 파일만 선택할 수 있습니다.');
        parentObj = obj.parentNode;
        node = parentObj.replaceChild(obj.cloneNode(true), obj);
        return false;
    }

    if (fileType == 'bmp') {
        upload = confirm('BMP 파일은 웹상에서 사용하기엔 적절한 이미지 포맷이 아닙니다.\n그래도 계속하시겠습니까?');
        if (upload == false) {
            return false;
        }
    }
};

$(document).on('click', '.browse', function () {
    var file = $(this).parent().parent().parent().find('.file');
    file.trigger('click');
});

$(document).on('change', '.file', function () {
    $value = $(this).val();
    console.log('change' + $value);
    var $valUploadInput = $(this).parent().find('#id_upload_image_input');
    if ($valUploadInput.length > 0) {
        $valUploadInput.val($value.replace(/C:\\fakepath\\/i, ''));

        var $removeBtn = $(this).parent().find('#remove-image-btn');
        $removeBtn.attr('disabled', false);
        // $removeBtn.toggleClass('disabled');
        // $removeBtn.show();
    }
});

$(document).on('click', '.remove-image', function () {
    console.log('Click Remove Btn');
    // $(this).closest('.form-group');
    // if ($.browser.msie) {
    //     // ie 일때 input[type=file] init.
    //     $("#filename").replaceWith($("#filename").clone(true));
    // } else {
    //     // other browser 일때 input[type=file] init.
    //     $("#filename").val("");
    // }
    var file = $(this).parent().parent().parent().find('.file');
    file.val('');

    // var $valUploadInput = $(this).parent().find('#id_upload_image_input');
    var $valUploadInput = $(this).parent().parent().parent().find('#id_upload_image_input');
    if ($valUploadInput.length > 0) {
        $valUploadInput.val('');
        var $removeBtn = $(this).parent().find('#remove-image-btn');
        $removeBtn.attr('disabled', true);
        // $removeBtn.toggleClass('disabled');
        // $removeBtn.hide();
    }
});

// // Fake file upload
// document.getElementById('fake-file-button-browse').addEventListener('click', function () {
//     document.getElementById('files-input-upload').click();
// });

// document.getElementById('files-input-upload').addEventListener('change', function () {
//     document.getElementById('fake-file-input-name').value = this.value;

//     document.getElementById('fake-file-button-upload').removeAttribute('disabled');
// });