const initDateInputs = () => {
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => input.value = new Date().toISOString().substring(0, 10));
}

const removeLettersAndSC = () => {
    const textInputs = document.querySelectorAll('input[type="number"]');
    textInputs.forEach(input => input.addEventListener('input', () =>
        input.value = input.value.replace(/[^0-9]+/g, '')));
}

const removeSpecialCharacters = () => {
    const textInputs = document.querySelectorAll('input[type="text"]');
    textInputs.forEach(input => input.addEventListener('input', () =>
        input.value = input.value.replace(/[^a-zA-Z0-9]+/g, '')));
}
