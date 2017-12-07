function updateJamoonList() {
    $('#id_tableBody').empty();
    var valID = $('#id_item').val();

    var sendUrl = "/process/logic/getCounsels?requestCounselId=";
    sendUrl += valID;
    console.log(sendUrl);

    $.ajax({
        type: 'get',
        dataType: 'json',
        url: sendUrl,
        cache: false,
        // async: true,
        success: function (result) {
            var j = JSON.stringify(result.CounselItems);
            if (j.length == 0) {
                alert("CounselItems:0");
            }
            ajaxEx2.parseJSON2(result.CounselItems);
        },
        error: function (request, err) {
            console.log('Interface:getCounsels Error:' + err.toString());
            var data = "<tr>";
            data += '<td colspan="4">';
            data += '<h4 align="center">등록된 자문이 없습니다</h4>';
            data += '</td>';
            data += '</tr>';
            $('#id_tableBody').html(data);
        }
    });

    var ajaxEx2 = {
        parseJSON2: function (result) {
            var data = "";
            $(result).each(function (i, item) {
                var index = parseInt(i) + parseInt(1);
                data += '<tr data-id=' + item.id + '>';
                data += '<td id="id_index">' + index + '</td>';
                data += '<td id="id_nick">' + item.expert_nick + '</td>';
                data += '<td id="id_title"><a id="id_title_link" href="#">' +
                    item.title +
                    '</a></td>';
                //data += '<td>' + item.created_at + '</td>';
                data += '<td id="id_created_at">' + item.created_at + '</td>';
                data += '<td style="display:none" id="id_expert_text" class="">';
                data += item.text;
                data += '</td>';
                data += '</tr>';
            });

            $('#id_tableBody').html(data);
        }
    }
}