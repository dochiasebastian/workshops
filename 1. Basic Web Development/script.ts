const API_URL = "http://localhost:3000";
const HEADERS = {
    "Content-Type": "application/json",
};
let ISLOCKED = false;
let randomGenerator = getRandomID();

document.addEventListener("DOMContentLoaded", () => {
    const lock = document.getElementById('lock') as HTMLInputElement

    ISLOCKED = lock.checked;

    const permisisonsForm = document.getElementById('permissions-form');

    const radios = document.querySelectorAll('input[name="preset"]') as NodeListOf<HTMLInputElement>;

    const popUp = document.getElementsByClassName('preferences')[0];

    const pmsBoxes = document.querySelectorAll('input[name="permissionPms"]') as NodeListOf<HTMLInputElement>;
    const allBoxes = document.querySelectorAll('input[name="permissionAll"]') as NodeListOf<HTMLInputElement>;

    const boxes = { pmsBoxes, allBoxes };

    handleRadios(radios, boxes);

    formSubmission(permisisonsForm);

    handleLock(lock, popUp);

    handlePopUp(popUp);
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

function handleLock(lock: HTMLInputElement, popUp: Element) {
    lock.addEventListener('change', (event) => {
        ISLOCKED = lock.checked;

        popUp.classList.remove('hidden');
        popUp.classList.remove('showing');

        if(ISLOCKED) {
            popUp.classList.add('showing');
        } else {
            popUp.classList.add('hidden');
        }

    });
}

function handlePopUp(popUp: Element) {
    if(ISLOCKED) {
        popUp.classList.add('showing');
        popUp.classList.remove('hidden');
    }

    popUp.addEventListener('click', () => {
        if(!this.ISLOCKED) {
            popUp.classList.add('showing');
            popUp.classList.remove('hidden');
        }
    });

    popUp.addEventListener('mouseleave', () => {
        if(!this.ISLOCKED) {
            popUp.classList.add('hidden');
            popUp.classList.remove('showing');
        }
    });
}

function changeBoxesState(boxes: NodeListOf<HTMLInputElement> , state: boolean) {
    boxes.forEach(box => {
        box.checked = state;
    });
}

function listHandler() {

}

function getRandomID() {
    let used: number[] = [];

    function getNumber() {
        const randomNo = Math.floor(Math.random() * 1000);
        if(used.includes(randomNo)) {
            getNumber();
        }
        used.push(randomNo);
        return randomNo;
    }

    return getNumber;
}

function permisisonsSeeder(permissions: Permission[]) {
    permissions.push(new Permission("Send all your data to Mr Zuck", "permissionNss"));
    permissions.push(new Permission("Record and store all private interactions", "permissionNss"));
    permissions.push(new Permission("Harvest device specifications", "permissionPms"));
    permissions.push(new Permission("Laugh at your poor life choices", "permissionPms"));
    permissions.push(new Permission("Send you daily monke memes", "permissionAll"));
    permissions.push(new Permission("Read Berserk by Kentaro Miura on your behalf", "permissionAll"));

    return permissions;
}

class Permission {
    type: string;
    text: string;
    id: string;

    constructor(type: string, text: string) {
        this.type = type;
        this.text = text;
        this.id = text.split(' ')[0].toLowerCase() + randomGenerator();
    }
}