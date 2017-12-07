// <textarea id="id_comment_content" class="form-control" rows="" cols="" readonly>
function createTextareaElem() {
    // var div = document.createElement('div');
    var elem = document.createElement('textarea');
    elem.id = 'id_comment_content';
    elem.className = 'form-control';
    elem.readOnly = true;
    // elem.setAttribute('rows', ' ');
    // elem.setAttribute('cols', ' ');

    // div.innerHTML = elem;

    return elem;
};