document.addEventListener("DOMContentLoaded", () => {
    const allRadios = document.querySelectorAll('input[name="preset"]');
    console.log(allRadios);

    addListenerToRadios(allRadios);
});

addListenerToRadios = (allRadios) => {
    allRadios.forEach(allRadio => {
        allRadio.addEventListener("change", event => {
            console.log(event.target.value);
        });
    })
}
