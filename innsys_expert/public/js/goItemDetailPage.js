// function goItemDetailPage(itemID) {
//     alert("goItemDetailPage");

//     $.get('../item_detail_inner.html', function(data) {
//         alert('itemID:' + itemID);
//         var data = data;

//         return data;
//     }, 'html');
// };

var getItemDetailPage = function(callback, dataID) {
    console.log("getItemDetailPage:" + dataID);
    
    $.ajax({
        type: 'get',
        url: '/process/logic/getDetailRequestCounselItem?id=' + dataID,
        dataType: 'json',

        success: function(result) {
            if (callback != null) {
                alert("getItemDetailPage:success");
            }
        },
        error: function(req, err) {
            alert("실패:getItemDetailPage");
        }
    })
};