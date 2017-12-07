$(function () {
    $('#id_logout').click(function (e) {
        e.preventDefault();

        console.log("Click Logout");

        $.ajax({
            type: 'get',
            dataType: 'text',
            url: '/process/users/logout',
            cache: false,
            async: false,
            success: function (result) {
                // alert("성공적인 로그아웃?");
                location.reload(true);
            },
            error: function (req, err) {
                // alert("실패!!!(실패하는데 왜 로그아웃되는거야)");
                location.reload(true);
            }
        });
    });
});