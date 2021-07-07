document.addEventListener("DOMContentLoaded", () => {
    const radios = document.querySelectorAll('input[name="preset"]');

    const pmsBoxes = document.querySelectorAll('input[name="permissionPms"]');
    const allBoxes = document.querySelectorAll('input[name="permissionAll"]');

    const boxes = {pmsBoxes, allBoxes};

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

changeBoxesState = (boxes, state) => {
    boxes.forEach(box => {
        box.checked = state;
    });
}