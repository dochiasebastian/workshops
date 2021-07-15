const API_URL = "http://localhost:3000";
const HEADERS = {
    "Content-Type": "application/json",
};

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('permissions-form');

    const radios = document.querySelectorAll('input[name="preset"]') as NodeListOf<HTMLInputElement>;

    const pmsBoxes = document.querySelectorAll('input[name="permissionPms"]') as NodeListOf<HTMLInputElement>;
    const allBoxes = document.querySelectorAll('input[name="permissionAll"]') as NodeListOf<HTMLInputElement>;

    const boxes = { pmsBoxes, allBoxes };

    handleRadios(radios, boxes);
    formSubmission(form);

    handlePopUp();
});

function handleRadios(radios: NodeListOf<HTMLInputElement>, boxes: { pmsBoxes: NodeListOf<HTMLInputElement>; allBoxes: NodeListOf<HTMLInputElement>; }) {
    radios.forEach(radio => {
        radio.addEventListener('change', event => {
            switch ((event.target as HTMLInputElement).value) {
                case "All":
                    this.changeBoxesState(boxes.pmsBoxes, true);
                    this.changeBoxesState(boxes.allBoxes, true);
                    break;

                case "Permissive":
                    this.changeBoxesState(boxes.pmsBoxes, true);
                    this.changeBoxesState(boxes.allBoxes, false);
                    break;

                case "Necessary":
                    this.changeBoxesState(boxes.pmsBoxes, false);
                    this.changeBoxesState(boxes.allBoxes, false);
                    break;

                default:
                    console.log("#ERROR");
                    break;
            }
        });
    });
}

function formSubmission (form: HTMLElement) {
    form.addEventListener('submit', (event: Event) => {
        event.preventDefault();

        const data: boolean = (document.getElementById('data') as HTMLInputElement).checked;
        const record: boolean = (document.getElementById('record') as HTMLInputElement).checked;
        const harvest: boolean = (document.getElementById('harvest') as HTMLInputElement).checked;
        const laugh: boolean = (document.getElementById('laugh') as HTMLInputElement).checked;
        const send: boolean = (document.getElementById('send') as HTMLInputElement).checked;
        const read: boolean = (document.getElementById('read') as HTMLInputElement).checked;

        const messageJSON = JSON.stringify({data, record, harvest, laugh, send, read});

        fetch(API_URL, { method: 'POST', headers: HEADERS, body: messageJSON })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch((error) => console.error('Error:', error));
    });
}

function handlePopUp() {
    const popUp = document.getElementsByClassName('preferences')[0];

    popUp.addEventListener('click', () => {
        popUp.classList.add('showing');
        popUp.classList.remove('hidden');

        popUp.addEventListener('mouseleave', () => {
            popUp.classList.add('hidden');
            popUp.classList.remove('showing');

            popUp.removeEventListener('mouseleave', () => {});
        });
    });
}

function changeBoxesState(boxes: NodeListOf<HTMLInputElement> , state: boolean) {
    boxes.forEach(box => {
        box.checked = state;
    });
}