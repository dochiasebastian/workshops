const API_URL = "http://localhost:3000";
const HEADERS = {
    "Content-Type": "application/json",
};
let ISLOCKED = false;
let COUNTER = 0;
let BOXES = {};
let PERMISSIONS: Permission[] = [];
let NOWEDITING: Permission;
let randomGenerator = getRandomID();

document.addEventListener("DOMContentLoaded", () => {
    loadRoutine();

    popUpRoutine();

    permissionsRoutine();

    radiosRoutine();

    routingRoutine();
});

function loadRoutine() {
    const squareCount = 9;

    const spinnner = document.querySelector(".spinner-grid.no-display");

    for(let i = 0; i < squareCount; i++) {
        const newSquare = document.createElement('div');
        newSquare.classList.add(`square${i + 1}`);
        spinnner.appendChild(newSquare);
    }

    document.getElementById('start-spinner').classList.add("no-display");
    document.getElementById('site-content').classList.remove("no-display");
}

function permissionsRoutine() {
    const permissionsForm = document.getElementById('permissions-form');

    toggleLoad(true);
    fetch(API_URL + '/pref', { method: 'GET', headers: HEADERS })
        .then(response => response.json())
        .then(data => {
            this.PERMISSIONS = data.data;
            createPermissionsForm(permissionsForm);
            formSubmission(permissionsForm);
            handleModification(permissionsForm);
            toggleLoad(false);
        })
        .catch((error) => console.error('Error:', error));
}

function popUpRoutine() {
    const popUp = document.getElementsByClassName('preferences')[0];
    const lock = document.getElementById('lock') as HTMLInputElement;
    const lock2 = document.getElementById('lock2') as HTMLInputElement;

    this.ISLOCKED = lock.checked;

    handlePopUp(lock, lock2, popUp);
}

function radiosRoutine() {
    this.BOXES = getBoxes();

    handleRadios();
}

function routingRoutine() {
    navigate(location.hash);

    window.addEventListener('hashchange', () => {
        navigate(location.hash);
    });
}

function navigate(toLocation: string) {
    if (toLocation == '#edit') {
        document.getElementById("creation-page").classList.add("no-display");
        document.getElementById("edit-page").classList.remove("no-display");

        document.getElementsByClassName("section")[1].classList.add("editing");

        document.getElementsByClassName("editor")[0].classList.remove('no-display');
        document.getElementsByClassName("preferences")[0].classList.remove('presentation');
        document.getElementsByClassName("begin-arrow")[0].classList.add('no-display');
    } else if (toLocation == '#create') {
        document.getElementById("creation-page").classList.remove("no-display");
        document.getElementById("edit-page").classList.add("no-display");

        document.getElementsByClassName("section")[1].classList.remove("editing");

        document.getElementsByClassName("editor")[0].classList.remove('no-display');
        document.getElementsByClassName("preferences")[0].classList.remove('presentation');
        document.getElementsByClassName("begin-arrow")[0].classList.add('no-display');
    } else {
        document.getElementsByClassName("editor")[0].classList.add('no-display');
        document.getElementsByClassName("preferences")[0].classList.add('presentation');
        document.getElementsByClassName("begin-arrow")[0].classList.remove('no-display');
    }
}

function getBoxes() {
    let pmsBoxes = document.querySelectorAll('input[name="permissionPms"]') as NodeListOf<HTMLInputElement>;
    let allBoxes = document.querySelectorAll('input[name="permissionAll"]') as NodeListOf<HTMLInputElement>;

    return { pmsBoxes, allBoxes };
}

function handleModification(form: HTMLElement) {
    document.addEventListener('click', event => {
        const target = event.target as HTMLInputElement
        if (target.classList.contains('edit-btn')) {
            document.getElementById('edit-form').classList.remove('no-display');

            const elemenToEdit: Permission = this.PERMISSIONS.filter((perm: Permission) => perm.id == target.name)[0];
            this.NOWEDITING = elemenToEdit;

            document.getElementById(elemenToEdit.type + 'Edit').click();
            (document.getElementById('permNameEdit') as HTMLInputElement).value = elemenToEdit.text;

            createPermissionsForm(form);
        } else if (target.classList.contains('delete-btn')) {
            if(NOWEDITING.id == target.name) {
                document.getElementById('edit-form').classList.add('no-display');
            }

            this.PERMISSIONS = this.PERMISSIONS.filter((el: Permission) => el.id != target.name);

            createPermissionsForm(form);

            fetch(API_URL + '/pref/delete', { method: 'DELETE', headers: HEADERS, body: JSON.stringify({ name: target.name }) })
                .then(response => response.json())
                .catch((error) => {
                    console.error('Error:', error);
                    permissionsRoutine();
                });
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
        newButtonDelete.classList.add('letter-btn');
        newButtonDelete.classList.add('delete-btn');

        const newButtonEdit = document.createElement("button");
        newButtonEdit.setAttribute('type', 'button');
        newButtonEdit.textContent = 'E';
        newButtonEdit.setAttribute('name', element.id);
        newButtonEdit.classList.add('letter-btn');
        newButtonEdit.classList.add('edit-btn');

        newElement.appendChild(newButtonEdit);
        newElement.appendChild(newButtonDelete);
        newElement.appendChild(newLabel);
        newElement.appendChild(newInput);

        permissionsList.appendChild(newElement);
    });

    setCounter();

    this.BOXES = getBoxes();
}

function setCounter() {
    const counterDisplay = document.getElementById("counter-display");
    removeChildren(counterDisplay);

    this.COUNTER = document.querySelectorAll('input[type="checkbox"]:checked').length;

    const newText = document.createElement('span');
    newText.textContent = `${this.COUNTER} permissions`;
    counterDisplay.appendChild(newText);
}

function handleRadios() {
    document.addEventListener('change', event => {
        if ((event.target as HTMLInputElement).name == "preset") {
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
                    break;
            }
        }

        setCounter();
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
        .catch((error) => {
            console.error('Error:', error);
            permissionsRoutine();
        });
}

function submitCreation(form: HTMLElement) {
    const type = document.querySelector('input[type=radio][name=presetC]:checked').id;
    const text = (document.getElementById('permName') as HTMLInputElement).value;

    if (!text) {
        document.getElementById('text-alert').classList.remove('no-display');
        return;
    } 
        
    document.getElementById('text-alert').classList.add('no-display');
    

    const newPermission = new Permission(text, type)

    this.PERMISSIONS.push(newPermission);

    fetch(API_URL + '/pref/create', { method: 'POST', headers: HEADERS, body: JSON.stringify(newPermission) })
        .then(response => response.json())
        .catch((error) => {
            console.error('Error:', error);
            permissionsRoutine();
        });

    createPermissionsForm(form);
}

function submitEdit(form: HTMLElement) {
    const type = document.querySelector('input[type=radio][name=presetE]:checked').id;
    const text = (document.getElementById('permNameEdit') as HTMLInputElement).value;

    if (!text) {
        document.getElementById('text-alert-edit').classList.remove('no-display');
        return;
    } 
        
    document.getElementById('text-alert-edit').classList.add('no-display');
    

    const index = this.PERMISSIONS.findIndex((perm: Permission) => perm.id == this.NOWEDITING.id);

    this.PERMISSIONS[index].type = type.replace('Edit', '');
    this.PERMISSIONS[index].text = text;

    document.getElementById('edit-form').classList.add('no-display');

    const messageJSON = JSON.stringify({ index: index, type: type.replace('Edit', ''), text: text });

    fetch(API_URL + '/pref/update', { method: 'PUT', headers: HEADERS, body: messageJSON })
        .then(response => response.json())
        .catch((error) => {
            console.error('Error:', error);
            permissionsRoutine();
        });

    createPermissionsForm(form);
}

function handlePopUp(lock: HTMLInputElement, lock2: HTMLInputElement, popUp: Element) {
    lock.addEventListener('click', (event) => {
        this.ISLOCKED = lock.checked;
        switchLock(lock2, popUp);
    });

    lock2.addEventListener('click', (event) => {
        this.ISLOCKED = lock2.checked;
        switchLock(lock, popUp);
    });

    if (this.ISLOCKED) {
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
        console.log(this.ISLOCKED);
        if (!this.ISLOCKED) {
            popUp.classList.add('hidden');
            popUp.classList.remove('showing');
        }
    });
}

function switchLock(lock: HTMLInputElement, popUp: Element) {
    popUp.classList.remove('hidden');
    popUp.classList.remove('showing');

    if (this.ISLOCKED) {
        popUp.classList.add('showing');
        lock.checked = true;
    } else {
        popUp.classList.add('hidden');
        lock.checked = false;
    }
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

function removeChildren(el: HTMLElement) {
    let child = el.lastElementChild;
    while (child) {
        el.removeChild(child);
        child = el.lastElementChild;
    }
}

function toggleLoad(isLoading: boolean) {
    if(isLoading) {
        this.document.getElementById("permissions-list").classList.add("no-display");
        this.document.getElementById("spinner").classList.remove("no-display");
    } else {
        this.document.getElementById("permissions-list").classList.remove("no-display");
        this.document.getElementById("spinner").classList.add("no-display");
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