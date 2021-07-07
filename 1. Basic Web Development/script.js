const API_URL = "http://localhost:3000";
const HEADERS = {
    "Content-Type": "application/json",
};

document.addEventListener("DOMContentLoaded", () => {
    const radios = document.querySelectorAll('input[name="preset"]');

    const pmsBoxes = document.querySelectorAll('input[name="permissionPms"]');
    const allBoxes = document.querySelectorAll('input[name="permissionAll"]');

    const boxes = { pmsBoxes, allBoxes };

    console.log(radios);
    console.log(boxes);

    addListenerToRadios(radios, boxes);
});

addListenerToRadios = (radios, boxes) => {
    radios.forEach(radio => {
        radio.addEventListener("change", event => {
            console.log(event.target.value);
            switch (event.target.value) {
                case "All":
                    changeBoxesState(boxes.pmsBoxes, true);
                    changeBoxesState(boxes.allBoxes, true);
                    break;

                case "Permissive":
                    changeBoxesState(boxes.pmsBoxes, true);
                    changeBoxesState(boxes.allBoxes, false);
                    break;

                case "Necessary":
                    changeBoxesState(boxes.pmsBoxes, false);
                    changeBoxesState(boxes.allBoxes, false);
                    break;

                default:
                    console.log("#ERROR");
                    break;
            }
        });
    });
}

onSubmit = () => {
    const data = document.getElementById('data').checked;
    const record = document.getElementById('record').checked;
    const harvest = document.getElementById('harvest').checked;
    const laugh = document.getElementById('laugh').checked;
    const send = document.getElementById('send').checked;
    const read = document.getElementById('read').checked;

    const message = `{"data": "${data}", "record": "${record}", "harvest": "${harvest}", "laugh": "${laugh}", "send": "${send}", "read": "${read}"}`

    messageJSON = JSON.parse(JSON.stringify(message));
    console.log(typeof(messageJSON));

    fetch(API_URL, { method: 'POST', headers: HEADERS, body: messageJSON })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch((error) => console.error('Error:', error));
}

changeBoxesState = (boxes, state) => {
    boxes.forEach(box => {
        box.checked = state;
    });
}