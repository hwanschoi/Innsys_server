document.write('<script src="/js/util.js"></script>');
document.write('<script src="/js/createElementData.js"></script>');

var getDetailItemComments = function (callback, dataID, targetHtmlID) {
    console.log("getDetailItemComments:" + dataID);

    var htmlID = '#' + targetHtmlID;
    $comments_body = $(htmlID);
    $comments_body.empty();

    var sendUrl = "/process/logic/getCounsels?requestCounselId=";
    sendUrl += dataID;
    console.log(sendUrl + "TEST20170529");

    // test json parse - begin
    // $.getJSON('/dummy/testJSON.json', function(data) {
    //     // var parse = JSON.stringify(data);
    //     testParse(data);
    // });

    function testParse(result) {
        // test data begin
        var testJson = [{
            "id": "58fd564f965b905cf29b7cad---depth(1)",
            "request_counsel_id": 0,
            "expert_id": "NoNo",
            "expert_nick": "depth(1)",
            "title": "",
            "text": "지우지마",
            "created_at": "2017-04-03T02:09:46.381Z",
            "attach_file": "",
            "children": ""
        }];
        // test data end
        console.log('resultID:' + result.id + "  size:" + result.length);
        var data = "";
        $(result).each(function (i, item) {
            // add Textarea : getTextArea / set Value / calc textarea Height

            console.log(item.id + '(index:' + i + ')');

            var $commentListSub = $('.comment-list-sub-sample').clone(true);
            $commentListSub.id = 'comment-list-sub';
            $commentListSub.attr('class', 'comment-list-sub');

            // 댓글 아이디
            var $itemID = $commentListSub.find('#id_comment_main_id');
            $itemID.attr('value', item.id);

            //debug info
            var $itemID = $commentListSub.find('#id_debug_info');
            var count = parseInt(i) + parseInt(1);
            $itemID.attr('value', item.id + ' count:' + count);

            // 사용자 프로필 썸네일
            var $userThumb = $commentListSub.find('#id_img_comment_user_thumb');
            $userThumb.attr('src', getUserThumbnail(item.user_thumb));

            // 사용자 Nickname
            var $commentName = $commentListSub.find('h6.comment-name');
            $commentName.text(item.expert_nick);

            // 사용자 Upload Image
            var $commentUploadImg = $commentListSub.find('#id_upload_image_thumb');
            // $commentUploadImg.attr('src', 'http://i.imgur.com/nFQAJCH.png');
            if ((typeof item.img_path != 'undefined') && (item.img_path.length > 0)) {
                var lastIdx = item.img_path.lastIndexOf('/userdata/');
                var strRealPath = item.img_path.substring(lastIdx, item.img_path.length);
                if (strRealPath.length > 0) {
                    $commentUploadImg.attr('src', strRealPath);
                }
            } else {
                var $removeElem = $commentListSub.find('#id_upload_image');
                $removeElem.remove();

                // var $d = $commentListSub.find('.comment-box');
                // console.log($d.html());
            }

            // 사용자 입력 댓글
            var $commentContent = $commentListSub.find('#id_comment_content');
            $commentContent.val(item.text);

            // 메인 리스트에 추가
            var $commentsBodyList = $('#comments-body').children('#comments-list');
            $commentsBodyList.append($commentListSub);
            // alert($('#comments-body').html());

            // calc textarea(id_comment_content)
            var textAreaHeight = $commentContent.get(0).scrollHeight;
            // console.log($itemID + ':(' + textAreaHeight + ')');
            $commentContent.height(textAreaHeight);

            // if ($.isEmptyObject(item.children) != true) {
            if (item.children && typeof item.children == 'object') {
                console.log('SUB REPLY LIST is <----START---->');
                $commentsBodyList.append('<ul class="comments-list reply-list" id="reply-list"></ul>');
                ajax.parseJsonExSubItem(item.children);
            }
        });
    };
    // test json parse - end

    $.ajax({
        type: 'get',
        dataType: 'json',
        url: sendUrl,
        cache: false,
        // async: true,
        success: function (result) {
            // var j = JSON.stringify(result.CounselItems);
            var j = JSON.stringify(result);
            if (j.length == 0) {
                alert("CounselItems:0");
                return;
            }

            //var data = ajax.parseJsonEx(result.CounselItems, false);
            var data = ajax.parseJsonEx(result, false);

            if (callback != null) {
                console.log("getDetailItemComments:success");

                callback(data);
                // $('#id_3rd').html(data);
            }
        },
        error: function (req, err) {
            console.log('GetDetailItemComments:Interface:getCounsels Error:' + err.toString());
            //등록된 자문이 없습니다.
            var data = "<tr>";
            data += '<td colspan="4">';
            data += '<h4 align="center">등록된 자문이 없습니다</h4>';
            data += '</td>';
            data += '</tr>';

            if (callback != null) {
                console.log("getDetailItemComments:error");
                callback(data);
            }

            return data;
        }
    });

    var ajax = {
        parseJsonExSubItem: function (result, parentID, depth) {

            // console.log('resultID:' + result.id + "  size:" + result.length);
            var data = "";
            $(result).each(function (i, item) {
                var $commentListSub = $('.comment-list-sub-reply-sample').clone(true);
                $commentListSub.attr('id', 'comment-list-sub-reply');
                $commentListSub.attr('class', 'comment-list-sub-reply');

                // Parent ID
                var $parentID = $commentListSub.find('#id_parent_id');
                $parentID.attr('value', parentID);

                // 댓글 아이디
                var $itemID = $commentListSub.find('#id_comment_sub_id');
                $itemID.attr('value', item.id);

                // User ID
                var $userID = $commentListSub.find('#id_comment_sub_user_id');
                $userID.attr('value', item.expert_id);

                //debug info
                var $debugID = $commentListSub.find('#id_debug_info');
                var count = parseInt(i) + parseInt(1);
                var depthResult = parseInt(depth) + parseInt(1);
                $debugID.attr('value', item.id + ' count:' + count + ' depth:' + depthResult);

                // 사용자 프로필 썸네일
                var $userThumb = $commentListSub.find('#id_img_comment_user_thumb');
                $userThumb.attr('src', getUserThumbnail(item.user_thumb));

                // 사용자 Nickname
                var $commentName = $commentListSub.find('h6.comment-name');
                $commentName.text(item.expert_nick);

                // check remove edit
                var checkMyCounsel = item.my_counsel;
                if (checkMyCounsel == false) {
                    var $commentBtnRemove = $commentListSub.find('#id_remove');
                    $commentBtnRemove.css('display', 'none');
                    var $commentBtnEdit = $commentListSub.find('#id_edit');
                    $commentBtnEdit.css('display', 'none');
                }


                // 사용자 Upload Image
                var $commentUploadImg = $commentListSub.find('#id_upload_image_thumb');
                // $commentUploadImg.attr('src', 'http://i.imgur.com/nFQAJCH.png');
                if ((typeof item.img_path != 'undefined') && (item.img_path.length > 0)) {
                    var lastIdx = item.img_path.lastIndexOf('/userdata/');
                    var strRealPath = item.img_path.substring(lastIdx, item.img_path.length);
                    if (strRealPath.length > 0) {
                        $commentUploadImg.attr('src', strRealPath);
                    }
                } else {
                    var $removeElem = $commentListSub.find('#id_upload_image');
                    $removeElem.remove();

                    // var $d = $commentListSub.find('.comment-box');
                    // console.log($d.html());
                }

                // 사용자 입력 댓글
                var $commentContent = $commentListSub.find('#id_comment_content');
                $commentContent.val(item.text);

                // 메인 리스트에 추가
                var $commentsReplyList = $('#comments-body').children('#comments-list').children('#reply-list').last();
                $commentsReplyList.append($commentListSub);
                // console.log("============" + $commentsReplyList.html());

                // calc textarea(id_comment_content)
                var textAreaHeight = $commentContent.get(0).scrollHeight;
                $commentContent.height(textAreaHeight);

                if (item.children && typeof item.children == 'object') {
                    console.log('SUB REPLY LIST is <----START---->');
                    ajax.parseJsonExSubItem(item.children, $itemID.attr('value'), depthResult);
                }
            });
        },

        parseJsonEx: function (result, isSubItem) {

            var data = "";
            $(result).each(function (i, item) {
                // add Textarea : getTextArea / set Value / calc textarea Height

                // setAttribute / attr 두개 구분에서 잘 써야한다.
                // var $emptyTextArea = $('#id_reply_textarea_sample').clone(true);
                // var $elem = createTextareaElem();
                // $elem.id = 'id_reply_textarea';
                // $elem.setAttribute('id', 'id_redjklfsjdfl');
                // $emptyTextArea.attr('id', 'id-djdjdjd');

                var $commentListSub = $('.comment-list-sub-sample').clone(true);
                $commentListSub.attr('id', 'comment-list-sub');
                $commentListSub.attr('class', 'comment-list-sub');

                // 댓글 아이디
                var $itemID = $commentListSub.find('#id_comment_main_id');
                $itemID.attr('value', item.id);

                // User ID
                var $userID = $commentListSub.find('#id_comment_main_user_id');
                $userID.attr('value', item.expert_id);

                //debug info
                var $debugID = $commentListSub.find('#id_debug_info');
                var count = parseInt(i) + parseInt(1);
                $debugID.attr('value', item.id + ' count:' + count);

                // 사용자 프로필 썸네일
                var $userThumb = $commentListSub.find('#id_img_comment_user_thumb');
                $userThumb.attr('src', getUserThumbnail(item.user_thumb));

                // 사용자 Nickname
                var $commentName = $commentListSub.find('h6.comment-name');
                $commentName.text(item.expert_nick);

                // check remove edit
                var checkMyCounsel = item.my_counsel;
                if (checkMyCounsel == false) {
                    var $commentBtnRemove = $commentListSub.find('#id_remove');
                    $commentBtnRemove.css('display', 'none');
                    var $commentBtnEdit = $commentListSub.find('#id_edit');
                    $commentBtnEdit.css('display', 'none');
                }

                // 사용자 Upload Image
                var $commentUploadImg = $commentListSub.find('#id_upload_image_thumb');
                // $commentUploadImg.attr('src', 'http://i.imgur.com/nFQAJCH.png');
                if ((typeof item.img_path != 'undefined') && (item.img_path.length > 0)) {
                    var lastIdx = item.img_path.lastIndexOf('/userdata/');
                    var strRealPath = item.img_path.substring(lastIdx, item.img_path.length);
                    if (strRealPath.length > 0) {
                        $commentUploadImg.attr('src', strRealPath);
                    }
                } else {
                    var $removeElem = $commentListSub.find('#id_upload_image');
                    $removeElem.remove();

                    // var $d = $commentListSub.find('.comment-box');
                    // console.log($d.html());
                }

                // 사용자 입력 댓글
                var $commentContent = $commentListSub.find('#id_comment_content');
                $commentContent.val(item.text);

                // 메인 리스트에 추가
                var $commentsBodyList = $('#comments-body').children('#comments-list');
                $commentsBodyList.append($commentListSub);
                // alert($('#comments-body').html());

                // calc textarea(id_comment_content)
                var textAreaHeight = $commentContent.prop('scrollHeight');
                // console.log($itemID + ':(' + textAreaHeight + ')');
                $commentContent.height(textAreaHeight);

                // if ($.isEmptyObject(item.children) != true) {
                if (item.children && typeof item.children == 'object') {
                    if (isSubItem == false) {
                        // comment-list-sub-reply-sample
                        // var $commentsReplyList = $('.comments-list .reply-list').clone(false);
                        // $commentsReplyList.empty();
                        $commentsBodyList.append('<ul class="comments-list reply-list" id="reply-list"></ul>');
                    }

                    ajax.parseJsonExSubItem(item.children, $itemID.attr('value'), 0);
                }
            });

            return data;
        }
    }
};