$(document).ready(function () {
    var fileTarget = $('.filebox .upload-hidden');

    fileTarget.on('change', function () {
        if (window.FileReader) {
            // 파일명 추출
            var filename = $(this)[0].files[0].name;
        } else {
            // Old IE 파일명 추출
            var filename = $(this).val().split('/').pop().split('\\').pop();
        };

        $(this).siblings('.upload-name').val(filename);
    });

    //preview image 
    var imgTarget = $('.preview-image .upload-hidden');

    imgTarget.on('change', function () {
        var parent = $(this).parent();
        parent.children('.upload-display').remove();

        if (window.FileReader) {
            //image 파일만
            if (!$(this)[0].files[0].type.match(/image\//)) return;

            var reader = new FileReader();
            reader.onload = function (e) {
                var src = e.target.result;
                parent.prepend('<div class="upload-display"><div class="upload-thumb-wrap"><img src="' + src + '" class="upload-thumb"></div></div>');
            }
            reader.readAsDataURL($(this)[0].files[0]);
        } else {
            $(this)[0].select();
            $(this)[0].blur();
            var imgSrc = document.selection.createRange().text;
            parent.prepend('<div class="upload-display"><div class="upload-thumb-wrap"><img class="upload-thumb"></div></div>');

            var img = $(this).siblings('.upload-display').find('img');
            img[0].style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enable='true',sizingMethod='scale',src=\"" + imgSrc + "\")";
        }
    });
});

function fileCheck(obj) {
    pathPoint = obj.value.lastIndexOf('.');
    filePoint = obj.value.substring(pathPoint+1, obj.length);
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