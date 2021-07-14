const API_URL = "http://localhost:3000";
const HEADERS = {
    "Content-Type": "application/json",
};
let ISLOCKED = false;
let BOXES = {};
let PERMISSIONS: Permission[] = [];
let NOWEDITING: Permission;
let randomGenerator = getRandomID();

document.addEventListener("DOMContentLoaded", () => {
    popUpRoutine();

    permissionsRoutine();

    radiosRoutine();
});

function permissionsRoutine() {
    const permissionsForm = document.getElementById('permissions-form');

    permissionsSeeder();
    createPermissionsForm(permissionsForm);
    formSubmission(permissionsForm);
    handleModification(permissionsForm);
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

function handleModification(form: HTMLElement) {
    document.addEventListener('click', event => {
        const target = event.target as HTMLInputElement
        if(target.classList.contains('delete-btn') && target.classList.contains('edit-btn')) {
            document.getElementById('edit-form').classList.remove('no-display');
            
            const elemenToEdit: Permission = this.PERMISSIONS.filter((perm: Permission) => perm.id == target.name)[0];
            this.NOWEDITING = elemenToEdit;

            document.getElementById(elemenToEdit.type + 'Edit').click();

            (document.getElementById('permNameEdit') as HTMLInputElement).value = elemenToEdit.text;
            createPermissionsForm(form);
        } else if(target.classList.contains('delete-btn')) {
            this.PERMISSIONS = this.PERMISSIONS.filter((el: Permission) => el.id != target.name);
            createPermissionsForm(form);
        } else if(target.id == 'begin-button') {
            document.getElementsByClassName("editor")[0].classList.remove('no-display');
            document.getElementsByClassName("preferences")[0].classList.remove('presentation');
            document.getElementsByClassName("begin-arrow")[0].classList.add('no-display');
        }

        
    });
}

function createPermissionsForm(form: HTMLElement) {
    const permissionsList = document.getElementById("permissions-list");
    removeChildren(permissionsList);

    this.PERMISSIONS.forEach((element: Permission) => {
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

        const newButtonDelete = document.createElement("button");
        newButtonDelete.setAttribute('type', 'button');
        newButtonDelete.textContent = 'X';
        newButtonDelete.setAttribute('name', element.id);
        newButtonDelete.classList.add('delete-btn');

        const newButtonEdit = document.createElement("button");
        newButtonEdit.setAttribute('type', 'button');
        newButtonEdit.textContent = 'E';
        newButtonEdit.setAttribute('name', element.id);
        newButtonEdit.classList.add('delete-btn');
        newButtonEdit.classList.add('edit-btn');

        newElement.appendChild(newButtonEdit);
        newElement.appendChild(newButtonDelete);
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

function formSubmission(form: HTMLElement) {
    document.addEventListener('submit', (event: Event) => {
        event.preventDefault();

        if ((event.target as HTMLElement).id == "permissions-form") {
            submitPermissions(form);

        } else if ((event.target as HTMLElement).id == "creation-form") {
            submitCreation(form);

        } else if ((event.target as HTMLElement).id == "edit-form") {
            submitEdit(form);
        }
    });
}

function submitPermissions(form: HTMLElement) {
    let messageData: { id: string, status: boolean }[] = [];

    this.PERMISSIONS.forEach((element: Permission) => {
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

function submitCreation(form: HTMLElement) {
    const type = document.querySelector('input[type=radio][name=presetC]:checked').id;
    const text = (document.getElementById('permName') as HTMLInputElement).value;

    if(!text){
        document.getElementById('text-alert').classList.remove('no-display');
        return;
    } else {
        document.getElementById('text-alert').classList.add('no-display');
    }

    this.PERMISSIONS.push(new Permission(text, type));

    createPermissionsForm(form);
}

function submitEdit(form:HTMLElement) {
    const type = document.querySelector('input[type=radio][name=presetE]:checked').id;
    const text = (document.getElementById('permNameEdit') as HTMLInputElement).value;

    if(!text){
        document.getElementById('text-alert-edit').classList.remove('no-display');
        return;
    } else {
        document.getElementById('text-alert-edit').classList.add('no-display');
    }

    const index = this.PERMISSIONS.findIndex((perm: Permission) => perm.id == this.NOWEDITING.id);

    this.PERMISSIONS[index].type = type.replace('Edit', '');
    this.PERMISSIONS[index].text = text;

    console.log(this.PERMISSIONS[index]);
    
    document.getElementById('edit-form').classList.add('no-display');

    createPermissionsForm(form);
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
        let randomNo = Math.floor(Math.random() * 1000);
        while (used.includes(randomNo)) {
            randomNo = Math.floor(Math.random() * 1000);
        } 

        used.push(randomNo);
        return randomNo;
    }
    return getNumber;
}

function permissionsSeeder() {
    this.PERMISSIONS.push(new Permission("Send all your data to Mr Zuck", "permissionNss"));
    this.PERMISSIONS.push(new Permission("Record and store all private interactions", "permissionNss"));
    this.PERMISSIONS.push(new Permission("Harvest device specifications", "permissionPms"));
    this.PERMISSIONS.push(new Permission("Laugh at your poor life choices", "permissionPms"));
    this.PERMISSIONS.push(new Permission("Send you daily monke memes", "permissionAll"));
    this.PERMISSIONS.push(new Permission("Read Berserk by Kentaro Miura on your behalf", "permissionAll"));
}

function removeChildren(el: HTMLElement) {
    let child = el.lastElementChild;
    while (child) {
        el.removeChild(child);
        child = el.lastElementChild;
    }
}

function clickToAdd() {
    document.getElementById("creation-page").classList.remove("no-display");
    document.getElementById("edit-page").classList.add("no-display");

    document.getElementsByClassName("section")[1].classList.remove("editing");
}

function clickToEdit() {
    document.getElementById("creation-page").classList.add("no-display");
    document.getElementById("edit-page").classList.remove("no-display");

    document.getElementsByClassName("section")[1].classList.add("editing");
}

class Permission {
    id: string;

    constructor(public text: string, public type: string) {
        this.type = type;
        this.text = text;
        this.id = text.split(' ')[0].toLowerCase() + randomGenerator();
    }
}