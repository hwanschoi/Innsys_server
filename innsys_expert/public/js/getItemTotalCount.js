// 메인화면 전체 아이템 카운트 가지고 오기

function makePagination(bMyPage) {
    //encodeURI 작업이 필요할 수 있음

    var callUrl = '/process/logic/getRequestCounselCount';

    if (bMyPage == true) {
        callUrl = '/process/mypage/getRequestCounselCount';
    }

    var retunHtml = "";
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: callUrl,
        cache: false,
        async: false,
        success: function (result) {
            console.log("Total ItemCount : " + result);

            if (result > 0) {
                retunHtml = makeHtml(result);
            }
        },
        error: function (request, error) {
            alert("실패!!!(makePagination)");
        }
    });

    return retunHtml;
}

function makeHtml(itemCount) {
    var html = "";
    html += '<div class="col-lg-12">';
    html += '<ul class="pagination">';
    html += '<li class="page_prev"><a href="javascript:void(0);">&laquo;</a></li>';

    var itemPerPage = 9;
    var pageCount = parseInt(itemCount / itemPerPage + 1);
    if (itemCount % itemPerPage == 0)
        pageCount -= 1;

    for (var i = 0; i < pageCount; i++) {
        if (i == 0) {
            html += '<li class="active page_num"><a href="javascript:void(0)">' + Number(i + 1) + '</a></li>';
        } else {
            html += '<li class="page_num"><a href="javascript:void(0)">' + Number(i + 1) + '</a></li>';
        }
    }
    // html += '<li class="active"><a href="#">1</a></li>';
    // html += '<li><a href="#">2</a></li>';
    // html += '<li><a href="#">3</a></li>';
    // html += '<li><a href="#">4</a></li>';
    // html += '<li><a href="#">5</a></li>';

    html += '<li class="page_next"><a href="javascript:void(0);">&raquo;</a></li>';
    html += '</ul>';
    html == '</div>';

    return html;

    //document.getElementById("id_pagination").html(html);
    // $('#id_pagination').html(html);
}