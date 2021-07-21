const API_URL = "http://localhost:5000/api/v1";
const HEADERS = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${document.cookie.split('=')[1]}`
};
let ISLOCKED = false;
let COUNTER = 0;
let BOXES = {};
let PERMISSIONS: Permission[] = [];
let CATEGORIES: Category[] = [];
let NOWEDITING: Permission;
let USER: User;
let randomGenerator = getRandomID();

document.addEventListener("DOMContentLoaded", () => {
    loadRoutine();

    categoriesRoutine();

    popUpRoutine();

    permissionsRoutine();

    radiosRoutine();

    routingRoutine();
});

function loadRoutine() {
    const squareCount = 9;

    const spinnner = document.querySelector(".spinner-grid.no-display");

    for (let i = 0; i < squareCount; i++) {
        const newSquare = document.createElement('div');
        newSquare.classList.add(`square${i + 1}`);
        spinnner.appendChild(newSquare);
    }

    document.getElementById('start-spinner').classList.add("no-display");

    fetch(API_URL + '/auth/me', { method: 'GET', headers: HEADERS })
        .then(response => response.json())
        .then(data => {
            if (data.success == true) {
                window.location.href = "#home";
                this.USER = data.data;
            }
        })
        .catch((error) => console.error('Error:', error));
}

function categoriesRoutine() {
    toggleLoad(true);
    fetch(API_URL + '/categories', { method: 'GET', headers: HEADERS })
        .then(response => response.json())
        .then(data => {
            this.CATEGORIES = data.data;

            const categoryForm = document.getElementById("categories-list");

            createCategoriesForms(categoryForm);
            createCategoriesFormDisplay()
            toggleLoad(false);
        })
        .catch((error) => console.error('Error:', error));
}

function permissionsRoutine() {
    const permissionsForm = document.getElementById('permissions-form');

    toggleLoad(true);
    fetch(API_URL + '/permissions', { method: 'GET', headers: HEADERS })
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
    const categoryForm = document.getElementById("categories-list");
    const categoryEditForm = document.getElementById("categories-list-edit");

    if (toLocation == '#edit' && this.USER) {
        document.getElementById("creation-page").classList.add("no-display");
        document.getElementById("edit-page").classList.remove("no-display");

        document.getElementsByClassName("section")[1].classList.add("editing");

        document.getElementsByClassName("editor")[0].classList.remove('no-display');
        document.getElementsByClassName("preferences")[0].classList.remove('presentation');
        document.getElementsByClassName("begin-arrow")[0].classList.add('no-display');

        removeChildren(categoryForm);
        createCategoriesForms(categoryEditForm);
    } else if (toLocation == '#create' && this.USER) {
        document.getElementById("creation-page").classList.remove("no-display");
        document.getElementById("edit-page").classList.add("no-display");

        document.getElementsByClassName("section")[1].classList.remove("editing");

        document.getElementsByClassName("editor")[0].classList.remove('no-display');
        document.getElementsByClassName("preferences")[0].classList.remove('presentation');
        document.getElementsByClassName("begin-arrow")[0].classList.add('no-display');

        removeChildren(categoryEditForm);
        createCategoriesForms(categoryForm);
    } else if (toLocation == '#signup') {
        document.getElementById('auth').classList.remove('no-display');
        document.getElementById('login-form').classList.add('no-display');
        document.getElementById('signup-form').classList.remove('no-display');
        document.getElementById('site-content').classList.add('no-display');
    } else if (toLocation == '#login') {
        document.getElementById('auth').classList.remove('no-display');
        document.getElementById('login-form').classList.remove('no-display');
        document.getElementById('signup-form').classList.add('no-display');
        document.getElementById('site-content').classList.add('no-display');
    } else if (toLocation == '#home' && this.USER) {
        document.getElementById('auth').classList.add('no-display');
        document.getElementsByClassName("editor")[0].classList.add('no-display');
        document.getElementsByClassName("preferences")[0].classList.add('presentation');
        document.getElementsByClassName("begin-arrow")[0].classList.remove('no-display');
        document.getElementById('site-content').classList.remove('no-display');

        document.querySelector(".begin-arrow p:first-child").innerHTML = `Hello ${this.USER.name}`
    } else {
        window.location.href = "#login";
    }
}

function createCategoriesForms(categoryForm: HTMLElement) {
    removeChildren(categoryForm);

    this.CATEGORIES.forEach((element: Category) => {
        const newSection = document.createElement('div');

        const newInput = document.createElement('input');
        newInput.setAttribute('id', element._id + "edit");
        newInput.setAttribute('name', 'presetC');
        newInput.setAttribute('type', 'radio');
        newInput.setAttribute('value', element.text);

        const newLabel = document.createElement('label');
        newLabel.setAttribute('for', element._id);
        newLabel.innerHTML = element.text;

        newSection.appendChild(newInput);
        newSection.appendChild(newLabel);

        categoryForm.appendChild(newSection);
    });
}

function createCategoriesFormDisplay() {
    const categoryForm = document.getElementById('categories-form-display');
    removeChildren(categoryForm);

    this.CATEGORIES.forEach((element: Category) => {
        const newSection = document.createElement('div');
        newSection.classList.add("grid-element");

        const newInput = document.createElement('input');
        newInput.setAttribute('id', element._id);
        newInput.setAttribute('name', 'preset');
        newInput.setAttribute('type', 'radio');
        newInput.setAttribute('value', element.text);

        const newLabel = document.createElement('label');
        newLabel.setAttribute('for', element._id);
        newLabel.innerHTML = element.text;

        newSection.appendChild(newLabel);
        newSection.appendChild(newInput);

        categoryForm.appendChild(newSection);
    });
}

function getBoxes() {
    const boxes: any = [];

    CATEGORIES.forEach((element: Category) => {
        boxes.push(document.querySelectorAll(`input[name="${element.text}"]`));
    });

    return boxes;
}

function handleModification(form: HTMLElement) {
    document.addEventListener('click', event => {
        const target = event.target as HTMLInputElement
        if (target.classList.contains('edit-btn')) {
            document.getElementById('edit-form').classList.remove('no-display');

            const elemenToEdit: Permission = this.PERMISSIONS.filter((perm: Permission) => perm._id == target.name)[0];
            this.NOWEDITING = elemenToEdit;

            document.getElementById(elemenToEdit.type + 'Edit').click();
            (document.getElementById('permNameEdit') as HTMLInputElement).value = elemenToEdit.text;

            createPermissionsForm(form);
        } else if (target.classList.contains('delete-btn')) {
            if (this.NOWEDITING && this.NOWEDITING._id == target.name) {
                document.getElementById('edit-form').classList.add('no-display');
            }

            this.PERMISSIONS = this.PERMISSIONS.filter((el: Permission) => el._id != target.name);

            createPermissionsForm(form);

            fetch(API_URL + '/permissions/delete', { method: 'DELETE', headers: HEADERS, body: JSON.stringify({ id: target.name }) })
                .then(response => response.json())
                .catch((error) => {
                    console.error('Error:', error);
                    permissionsRoutine();
                });
        } else if (target.id == "create-category-btn") {
            const category = (document.getElementById('categoryNameEdit') as HTMLInputElement).value;

            if (!category) {
                return;
            }

            console.log(category);

            fetch(API_URL + '/categories', { method: 'POST', headers: HEADERS, body: JSON.stringify({ text: category }) })
                .then(response => response.json())
                .then(data => {
                    this.CATEGORIES.push(data.data);
                    const categoryForm = document.getElementById("categories-list");

                    createCategoriesForms(categoryForm);
                    createCategoriesFormDisplay();
                })
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
        newLabel.setAttribute('for', element._id);
        newLabel.innerHTML = element.text;

        const newInput = document.createElement("input");
        newInput.setAttribute('id', element._id);
        newInput.setAttribute('name', element.type);
        newInput.setAttribute('type', 'checkbox');

        if (element.type == "60f7d659d2a13b41e05f1ee4") {
            newInput.click();
            newInput.disabled = true;
        }

        const newButtonDelete = document.createElement("button");
        newButtonDelete.setAttribute('type', 'button');
        newButtonDelete.textContent = 'X';
        newButtonDelete.setAttribute('name', element._id);
        newButtonDelete.classList.add('letter-btn');
        newButtonDelete.classList.add('delete-btn');

        const newButtonEdit = document.createElement("button");
        newButtonEdit.setAttribute('type', 'button');
        newButtonEdit.textContent = 'E';
        newButtonEdit.setAttribute('name', element._id);
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

    this.COUNTER = document.querySelectorAll('.list input[type="checkbox"]:checked').length;

    const newText = document.createElement('span');
    newText.textContent = `${this.COUNTER} permissions`;
    counterDisplay.appendChild(newText);
}

function handleRadios() {
    document.addEventListener('change', event => {
        const target = (event.target as HTMLInputElement)
        if (target.name == "preset") {
            const allBoxes: NodeListOf<HTMLInputElement> = document.querySelectorAll('form input[type="checkbox"]:not(input[name="60f7d659d2a13b41e05f1ee4"])');
            changeBoxesState(allBoxes, false);

            const boxes: NodeListOf<HTMLInputElement> = document.querySelectorAll(`form input[type="checkbox"][name="${target.id}"]`);

            changeBoxesState(boxes, true);
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

        } else if ((event.target as HTMLElement).id == "login-form") {
            submitLogin(form);

        } else if ((event.target as HTMLElement).id == "signup-form") {
            submitSignUp();

        }
    });
}

function submitPermissions(form: HTMLElement) {
    let messageData: { id: string, status: boolean }[] = [];

    this.PERMISSIONS.forEach((element: Permission) => {
        let checkedStatus = (document.getElementById(element._id) as HTMLInputElement).checked;

        let newData = { "id": element._id, "status": checkedStatus };

        messageData.push(newData);
    });

    const messageJSON = JSON.stringify(messageData);

    fetch(API_URL + '/permissions', { method: 'POST', headers: HEADERS, body: messageJSON })
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

    const newPermission = new Permission(text, type.replace("edit", ''));

    this.PERMISSIONS.push(newPermission);

    fetch(API_URL + '/permissions', { method: 'POST', headers: HEADERS, body: JSON.stringify(newPermission) })
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

    const index = this.PERMISSIONS.findIndex((perm: Permission) => perm._id == this.NOWEDITING._id);

    this.PERMISSIONS[index].type = type.replace('Edit', '');
    this.PERMISSIONS[index].text = text;

    document.getElementById('edit-form').classList.add('no-display');

    const messageJSON = JSON.stringify({ id: this.NOWEDITING._id, type: type.replace('Edit', ''), text: text });

    fetch(API_URL + '/permissions/update', { method: 'PUT', headers: HEADERS, body: messageJSON })
        .then(response => response.json())
        .catch((error) => {
            console.error('Error:', error);
            permissionsRoutine();
        });

    createPermissionsForm(form);
}

function submitLogin(form: HTMLElement) {
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    const errorMessage = document.getElementById('text-alert-login');

    if (!email || !password) {
        errorMessage.innerHTML = 'Both fields are required';
        errorMessage.classList.remove('no-display');
        return;
    }

    const messageJSON = JSON.stringify({ email: email, password: password });

    fetch(API_URL + '/auth/login', { method: 'POST', headers: HEADERS, body: messageJSON })
        .then(response => response.json())
        .then(data => {
            if (data.success == false) {
                errorMessage.innerHTML = data.error;
                errorMessage.classList.remove('no-display');
            } else {
                document.cookie = `token=${data.token}; path=/`;
                window.location.reload();
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function submitSignUp() {
    const name = (document.getElementById('nameS') as HTMLInputElement).value;
    const email = (document.getElementById('emailS') as HTMLInputElement).value;
    const password = (document.getElementById('passwordS') as HTMLInputElement).value;

    const errorMessage = document.getElementById('text-alert-login');

    if (!name || !email || !password) {
        errorMessage.innerHTML = 'All fields are required';
        errorMessage.classList.remove('no-display');
        return;
    }

    const messageJSON = JSON.stringify({ name: name, email: email, password: password });

    fetch(API_URL + '/auth/register', { method: 'POST', headers: HEADERS, body: messageJSON })
        .then(response => response.json())
        .then(data => {
            if (data.success == false) {
                errorMessage.innerHTML = data.error;
                errorMessage.classList.remove('no-display');
            } else {
                document.cookie = `token=${data.token}; path=/`;
                window.location.reload();
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
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
    if (isLoading) {
        this.document.getElementById("permissions-list").classList.add("no-display");
        this.document.getElementById("spinner").classList.remove("no-display");
    } else {
        this.document.getElementById("permissions-list").classList.remove("no-display");
        this.document.getElementById("spinner").classList.add("no-display");
    }
}

class Permission {
    _id: string;

    constructor(public text: string, public type: string) {
        this.type = type;
        this.text = text;
    }
}

interface User {
    name: string,
    email: string,
}

interface Category {
    _id: string,
    text: string
}