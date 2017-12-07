// Common Util Javascript

function checkValidData(data) {
    if ((typeof data != 'undefined') && (typeof data.valueOf() == 'string') && data.length > 0) {
        return data;
    }

    return '-';
}

//"http://placehold.it/700x400"
function checkImage(data) {
    if ((typeof data != 'undefined') && (typeof data.valueOf() == 'string') && data.length > 0) {
        return data;
    }

    return 'images/placeholder.png';
}

function checkMeasurePartThumb(data) {
    if ((typeof data != 'undefined') && (typeof data.valueOf() == 'string') && data.length > 0) {
        return data;
    }

    return '/images/detail_item_measure_part_thumb.png';
}

function getUseTitle(data) {
    if ((typeof data != 'undefined') && (typeof data.valueOf() == 'string') && data.length > 0) {
        return data;
    }

    return '제목없음';
}

function getUserThumbnail(data) {
    if ((typeof data != 'undefined') && (typeof data.valueOf() == 'string') && data.length > 0) {
        return data;
    }

    return '/images/default_user_thumb.png';
}

function getSexManWoman(data) {
    var sex = "";
    if (data == 'M') {
        sex = "남자";
    } else if (data == 'F') {
        sex = "여자";
    } else {
        sex = "알수없음";
    }

    return sex;
}

function getSkinType(data) {
    var skin = "";

    if (data == 'd') {
        skin = "건성";
    } else if (data == 'w') {
        skin = "지성";
    } else {
        skin = "알수없음";
    }

    return skin;
}

function getSeanYN(data) {
    var Sean = "";

    if (data == 'y') {
        Sean = "했다";
    } else if (data == 'n') {
        Sean = "안했다";
    } else {
        Sean = "알수없음";
    }

    return Sean;
}

function getDrinkYN(data) {
    var Drink = "";

    if (data == 'y') {
        Drink = "했다";
    } else if (data == 'n') {
        Drink = "안했다";
    } else {
        Drink = "알수없음";
    }

    return Drink;
}

function getSmokeYN(data) {
    var Smoke = "";

    if (data == 'y') {
        Smoke = "했다";
    } else if (data == 'n') {
        Smoke = "안했다";
    } else {
        Smoke = "알수없음";
    }

    return Smoke;
}

function getMeasurePartIcon(data) {
    var icon = "";

    switch (data) {
        case '턱':
            icon = "/images/mp_jaw.png";
            break;
        case '피부':
            icon = "/images/mp_epidermis.png";
            break;
        case '이마':
            icon = "/images/mp_brow.png";
            break;
        case '코':
            icon = "/images/mp_nose.png";
            break;
        case '볼':
            icon = "/images/mp_cheek.png";
            break;
        case '귀':
            icon = "/images/mp_ear.png";
            break;
        case '거기':
            icon = "/images/mp_ear.png";
            break;
        default:
            icon = "/images/mp_default.png";
            break;
    }

    return icon;
}

function getDateFormat(data) {
    var retDate = "No Date";

    if ((typeof data != 'undefined') && (typeof data.valueOf() == 'string') && data.length > 0) {
        var date = new Date(data);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        if (month < 10) {
            month = '0' + month;
        }
        var day = date.getDate();
        if (day < 10) {
            day = '0' + day;
        }

        retDate = year + "-" + month + "-" + day;

        // retDate = new Date(data).toISOString();
    }

    return retDate;
}

function validEmailID(valID) {
    // var id = document.forms["myForm"]["id"].value;
    var id = valID;
    var atpos = id.indexOf('@');
    var dotpos = id.lastIndexOf('.');
    if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= id.length) {
        alert("올바른 이메일(E-mail) 형식이 아닙니다.");
        return false;
    }
}