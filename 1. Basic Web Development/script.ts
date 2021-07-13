const API_URL = "http://localhost:3000";
const HEADERS = {
    "Content-Type": "application/json",
};
let ISLOCKED = false;
let randomGenerator = getRandomID();

document.addEventListener("DOMContentLoaded", () => {
    popUpRoutine();
    
    permissionsRoutine();

    radiosRoutine();
});

function permissionsRoutine() {
    let permisisons: Permission[] = permisisonsSeeder([]);
    const permisisonsForm = document.getElementById('permissions-form');

    createPermisisonsForm(permisisons, permisisonsForm);
    formSubmission(permisisonsForm, permisisons);
}

function popUpRoutine() {
    const popUp = document.getElementsByClassName('preferences')[0];
    const lock = document.getElementById('lock') as HTMLInputElement;

    ISLOCKED = lock.checked;

    handleLock(lock, popUp);
    handlePopUp(popUp);
}

function radiosRoutine() {
    const radios = document.querySelectorAll('input[name="preset"]') as NodeListOf<HTMLInputElement>;

    const pmsBoxes = document.querySelectorAll('input[name="permissionPms"]') as NodeListOf<HTMLInputElement>;
    const allBoxes = document.querySelectorAll('input[name="permissionAll"]') as NodeListOf<HTMLInputElement>;
    const boxes = { pmsBoxes, allBoxes };

    handleRadios(radios, boxes);
}

function createPermisisonsForm(permisisons: Permission[], form: HTMLElement) {
    const permissionsList = document.getElementById("permisisons-list");
    removeChildren(permissionsList);

    permisisons.forEach(element => {
        const newElement = document.createElement("div");
        newElement.classList.add("grid-element");

        const newLabel = document.createElement("label");
        newLabel.setAttribute('for', element.id);
        newLabel.innerHTML = element.text;

        const newInput = document.createElement("input");
        newInput.setAttribute('id', element.id);
        newInput.setAttribute('name', element.type);
        newInput.setAttribute('type', 'checkbox');

        if(element.type == "permissionNss") {
            newInput.click();
            newInput.disabled = true;
        }

        newElement.appendChild(newLabel);
        newElement.appendChild(newInput);

        permissionsList.appendChild(newElement);
    });
}

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

function formSubmission (form: HTMLElement, permissions: Permission[]) {
    form.addEventListener('submit', (event: Event) => {
        event.preventDefault();

        let messageData: {id: string, status: boolean}[] = [];

        permissions.forEach(element => {
            let checkedStatus = (document.getElementById(element.id) as HTMLInputElement).checked;
   
            let newData = {"id": element.id, "status": checkedStatus};

            messageData.push(newData);
        });

        const messageJSON = JSON.stringify(messageData);

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

function removeChildren(el: HTMLElement) {
    let child = el.lastElementChild;
    while(child) {
        console.log(child);
        el.removeChild(child);
        child = el.lastElementChild;
    }
}

class Permission {
    text: string;
    type: string;
    id: string;

    constructor(text: string, type: string) {
        this.type = type;
        this.text = text;
        this.id = text.split(' ')[0].toLowerCase() + randomGenerator();
    }
}