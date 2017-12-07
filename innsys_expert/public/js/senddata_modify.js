function modifyData() {
    //var valID = $('#data_id').val();
    var valID = $('#id_register_id').val();
    // var valID = $(this).attr('data-id');
    var valTitle = $('#id_register_title').val();
    var valText = $('#id_register_body').val();

    var sendUrl = "/process/logic/updateCounsel";

    // requestCounselId, title, text
    var dataInfo = {
        id: valID,
        title: $('#id_register_title').val(),
        text: $('#id_register_body').Editor('getText')
    }

    console.log(dataInfo);

    $.ajax({
        type: 'post',
        dataType: 'text',
        data: dataInfo,
        url: sendUrl,
        cache: false,
        // async: false,
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        complete: function (result) {
            //alert("수정이 성공하였습니다.")
            // $.modal.close();
        },
        success: function (result) {
            console.log(result);
            updateJamoonList();

            $('#id_modal_body').show();
            $('#id_register').show();
            $('#register_dlg').hide();
            // $('#id_modal_body').show();
            // $('#id_register').show();
            // $('#register_dlg').hide();
        },
        error: function (request, err) {
            alert("fail:" + err.toString());
        }
    });
}