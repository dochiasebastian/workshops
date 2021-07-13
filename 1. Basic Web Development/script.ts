const API_URL = "http://localhost:3000";
const HEADERS = {
    "Content-Type": "application/json",
};
let ISLOCKED = false;
let BOXES = {};
let randomGenerator = getRandomID();

document.addEventListener("DOMContentLoaded", () => {
    popUpRoutine();

    permissionsRoutine();

    radiosRoutine();
});

function permissionsRoutine() {
    let permissions: Permission[] = permissionsSeeder([]);
    const permissionsForm = document.getElementById('permissions-form');

    createPermissionsForm(permissions, permissionsForm);
    formSubmission(permissionsForm, permissions);
}

function popUpRoutine() {
    const popUp = document.getElementsByClassName('preferences')[0];
    const lock = document.getElementById('lock') as HTMLInputElement;

    ISLOCKED = lock.checked;

    handleLock(lock, popUp);
    handlePopUp(popUp);
}

function radiosRoutine() {
    this.BOXES = getBoxes();

    handleRadios();
}

function getBoxes() {
    let pmsBoxes = document.querySelectorAll('input[name="permissionPms"]') as NodeListOf<HTMLInputElement>;
    let allBoxes = document.querySelectorAll('input[name="permissionAll"]') as NodeListOf<HTMLInputElement>;

    return { pmsBoxes, allBoxes };
}

function createPermissionsForm(permissions: Permission[], form: HTMLElement) {
    const permissionsList = document.getElementById("permissions-list");
    removeChildren(permissionsList);

    permissions.forEach(element => {
        const newElement = document.createElement("div");
        newElement.classList.add("grid-element");

        const newLabel = document.createElement("label");
        newLabel.setAttribute('for', element.id);
        newLabel.innerHTML = element.text;

        const newInput = document.createElement("input");
        newInput.setAttribute('id', element.id);
        newInput.setAttribute('name', element.type);
        newInput.setAttribute('type', 'checkbox');

        if (element.type == "permissionNss") {
            newInput.click();
            newInput.disabled = true;
        }

        newElement.appendChild(newLabel);
        newElement.appendChild(newInput);

        permissionsList.appendChild(newElement);

    });

    this.BOXES = getBoxes();
}

function handleRadios() {
    document.addEventListener('change', event => {
        if((event.target as HTMLInputElement).name == "preset") {
            switch ((event.target as HTMLInputElement).value) {
                case "All":
                    this.changeBoxesState(this.BOXES.pmsBoxes, true);
                    this.changeBoxesState(this.BOXES.allBoxes, true);
                    break;
    
                case "Permissive":
                    this.changeBoxesState(this.BOXES.pmsBoxes, true);
                    this.changeBoxesState(this.BOXES.allBoxes, false);
                    break;
    
                case "Necessary":
                    this.changeBoxesState(this.BOXES.pmsBoxes, false);
                    this.changeBoxesState(this.BOXES.allBoxes, false);
                    break;
    
                default:
                    console.log("#ERROR");
                    break;
            }
        }
    });
}

function formSubmission(form: HTMLElement, permissions: Permission[]) {
    document.addEventListener('submit', (event: Event) => {
        event.preventDefault();

        if ((event.target as HTMLElement).id == "permissions-form") {
            submitPermissions(form, permissions);

        } else if ((event.target as HTMLElement).id == "creation-form") {
            submitCreation(form, permissions);

        }
    });
}

function submitPermissions(form: HTMLElement, permissions: Permission[]) {
    let messageData: { id: string, status: boolean }[] = [];

    permissions.forEach(element => {
        let checkedStatus = (document.getElementById(element.id) as HTMLInputElement).checked;

        let newData = { "id": element.id, "status": checkedStatus };

        messageData.push(newData);
    });

    const messageJSON = JSON.stringify(messageData);

    fetch(API_URL, { method: 'POST', headers: HEADERS, body: messageJSON })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch((error) => console.error('Error:', error));
}

function submitCreation(form: HTMLElement, permissions: Permission[]) {
    const type = document.querySelector('input[type=radio][name=presetC]:checked').id;
    const text = (document.getElementById('permName') as HTMLInputElement).value;

    permissions.push(new Permission(text, type));

    createPermissionsForm(permissions, form);
}

function handleLock(lock: HTMLInputElement, popUp: Element) {
    lock.addEventListener('change', (event) => {
        ISLOCKED = lock.checked;

        popUp.classList.remove('hidden');
        popUp.classList.remove('showing');

        if (ISLOCKED) {
            popUp.classList.add('showing');
        } else {
            popUp.classList.add('hidden');
        }

    });
}

function handlePopUp(popUp: Element) {
    if (ISLOCKED) {
        popUp.classList.add('showing');
        popUp.classList.remove('hidden');
    }

    popUp.addEventListener('click', () => {
        if (!this.ISLOCKED) {
            popUp.classList.add('showing');
            popUp.classList.remove('hidden');
        }
    });

    popUp.addEventListener('mouseleave', () => {
        if (!this.ISLOCKED) {
            popUp.classList.add('hidden');
            popUp.classList.remove('showing');
        }
    });
}

function changeBoxesState(boxes: NodeListOf<HTMLInputElement>, state: boolean) {
    boxes.forEach(box => {
        box.checked = state;
    });
}

function getRandomID() {
    let used: number[] = [];

    function getNumber() {
        const randomNo = Math.floor(Math.random() * 1000);
        if (used.includes(randomNo)) {
            getNumber();
        }
        used.push(randomNo);
        return randomNo;
    }

    return getNumber;
}

function permissionsSeeder(permissions: Permission[]) {
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
    while (child) {
        el.removeChild(child);
        child = el.lastElementChild;
    }
}

class Permission {
    id: string;

    constructor(public text: string, public type: string) {
        this.type = type;
        this.text = text;
        this.id = text.split(' ')[0].toLowerCase() + randomGenerator();
    }
}