import scriptConfig from "../../config/exchanger.js";

const tag = scriptConfig.fieldTag;

const checkLengthHandler = () => {
    const addressInput = document.querySelector(`.field-wrapper.address input[name="${tag}-address"]`);
    const cardInput = document.querySelector(`.field-wrapper.card input[name="${tag}-card"]`);
    const sendInput = document.querySelector('.field-wrapper.send input[name="number-input"]');
    const receiveInput = document.querySelector('.field-wrapper.receive input[name="number-input"]');

    const inputHandler = e => {
        const fieldWrapper = e.target.parentElement;

        const fieldCheckEmpty = e.target.dataset.empty;
        const fieldLength = e.target.dataset.length;

        if(fieldCheckEmpty) {
            if(e.target.value != '') {
                fieldWrapper.classList.remove('error');
            }
        }

        if(fieldLength) {
            if(e.target.value.length == fieldLength) {
                fieldWrapper.classList.remove('error');
            }
        }
    }

    /*
    const numberInputFocusHandler = e => {
        const fieldWrapper = e.target.parentElement.parentElement;

        if (fieldWrapper.classList.contains('error')) {
            fieldWrapper.classList.remove('error');
        }
    }

    const numberInputBlurHandler = e => {
        const fieldWrapper = e.target.parentElement.parentElement;

        if (e.target.value.length > 0) {
            if (fieldWrapper.classList.contains('error')) {
                fieldWrapper.classList.remove('error');
            }
        }
        else {
            if (!fieldWrapper.classList.contains('error')) {
                fieldWrapper.classList.add('error');
            }
        }
    }*/

    addressInput.addEventListener('input', inputHandler);
    cardInput.addEventListener('input', inputHandler);

    /*
    sendInput.addEventListener('blur', numberInputBlurHandler);
    sendInput.addEventListener('focus', numberInputFocusHandler);
    receiveInput.addEventListener('blur', numberInputBlurHandler);
    receiveInput.addEventListener('focus', numberInputFocusHandler);
    */
}

export default checkLengthHandler;