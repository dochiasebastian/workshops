var API_URL = "http://localhost:3000";
var HEADERS = {
    "Content-Type": "application/json"
};
document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById('permissions-form');
    var radios = document.querySelectorAll('input[name="preset"]');
    var pmsBoxes = document.querySelectorAll('input[name="permissionPms"]');
    var allBoxes = document.querySelectorAll('input[name="permissionAll"]');
    var boxes = { pmsBoxes: pmsBoxes, allBoxes: allBoxes };
    handleRadios(radios, boxes);
    formSubmission(form);
    handlePopUp();
});
function handleRadios(radios, boxes) {
    var _this = this;
    radios.forEach(function (radio) {
        radio.addEventListener('change', function (event) {
            switch (event.target.value) {
                case "All":
                    _this.changeBoxesState(boxes.pmsBoxes, true);
                    _this.changeBoxesState(boxes.allBoxes, true);
                    break;
                case "Permissive":
                    _this.changeBoxesState(boxes.pmsBoxes, true);
                    _this.changeBoxesState(boxes.allBoxes, false);
                    break;
                case "Necessary":
                    _this.changeBoxesState(boxes.pmsBoxes, false);
                    _this.changeBoxesState(boxes.allBoxes, false);
                    break;
                default:
                    console.log("#ERROR");
                    break;
            }
        });
    });
}
function formSubmission(form) {
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        var data = document.getElementById('data').checked;
        var record = document.getElementById('record').checked;
        var harvest = document.getElementById('harvest').checked;
        var laugh = document.getElementById('laugh').checked;
        var send = document.getElementById('send').checked;
        var read = document.getElementById('read').checked;
        var messageJSON = JSON.stringify({ data: data, record: record, harvest: harvest, laugh: laugh, send: send, read: read });
        fetch(API_URL, { method: 'POST', headers: HEADERS, body: messageJSON })
            .then(function (response) { return response.json(); })
            .then(function (data) { return console.log(data); })["catch"](function (error) { return console.error('Error:', error); });
    });
}
function handlePopUp() {
    var popUp = document.getElementsByClassName('preferences')[0];
    popUp.addEventListener('click', function () {
        popUp.classList.add('showing');
        popUp.classList.remove('hidden');
        popUp.addEventListener('mouseleave', function () {
            popUp.classList.add('hidden');
            popUp.classList.remove('showing');
            popUp.removeEventListener('mouseleave', function () { });
        });
    });
}
function changeBoxesState(boxes, state) {
    boxes.forEach(function (box) {
        box.checked = state;
    });
}
