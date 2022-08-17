const divEncryptor = document.querySelector(".content-container__input");
const crypto = ["ai", "enter", "imes", "ober", "ufat"];
const decrypto = ["a", "e", "i", "o", "u"];
const result = document.querySelector(".result");
const btnEncrypt = document.querySelector(".btn--encrypt");
const btnDecrypt = document.querySelector(".btn--decrypt");
const btnCopy = document.querySelector(".btn--copy");
const copyMessage = document.querySelector(".message--custom-tooltip");
const frame5 = document.querySelector(".frame--frame5");

divEncryptor.focus();

/**
 * Encrypt a text.
 * @param  {string} originalValue The original text
 * @return {string}      The crypted text
 */
function getCryptedValue(originalValue) {
    let cryptedValue = "";
    for (let char of originalValue) {
        // Determining whether the char is a vowel or not
        let position = decrypto.indexOf(char);
        // In case of vowel, it adds the whole code, otherwise, only add the char
        cryptedValue += position >= 0 ? crypto[position] : char;
    }
    return cryptedValue;
}

/**
 * Decrypt a text.
 * @param  {string} cryptedValue Text that is supposedly encrypted.
 * @return {string}      The decrypted text.
 */
function getDecryptedValue(cryptedValue) {
    let decryptedValue = "";
    let i = 0;
    // Iteration of the string while concatenating to the result
    while (i < cryptedValue.length) {
        decryptedValue += cryptedValue[i];
        // Determining whether the char is a vowel or not
        let position = decrypto.indexOf(cryptedValue[i]);
        // In case of vowel, if it is continued by the rest of the code of the vowel in question, it skips those letters
        // So in the following iterations they will not be taken into account
        if (
            position >= 0 &&
            cryptedValue.slice(i, i + crypto[position].length) ===
                crypto[position]
        ) {
            i += crypto[position].length - 1;
        }
        i++;
    }
    return decryptedValue;
}

btnEncrypt.addEventListener("click", () => {
    result.textContent = getCryptedValue(divEncryptor.textContent.trim());
    changeJustifyContent();
    if (checkEmptyContent()) return;
    divEncryptor.innerHTML = "";
    showSuccesfulMessage(document.querySelector(".message--encrypt-succesful"));
});

btnDecrypt.addEventListener("click", () => {
    result.textContent = getDecryptedValue(divEncryptor.textContent.trim());
    changeJustifyContent();
    if (checkEmptyContent()) return;
    divEncryptor.innerHTML = "";
    showSuccesfulMessage(document.querySelector(".message--decrypt-succesful"));
});

/**
 * Changes justify-content of frame5 (the result container) from center to space-between
 * or vice versa, depending wether the result contains something or not.
 */
function changeJustifyContent() {
    frame5.style.justifyContent = result.innerHTML ? "space-between" : "center";
}

let copyTimeOut;
btnCopy.addEventListener("click", (e) => {
    navigator.clipboard.writeText(result.textContent);
    copyTimeOut = copiedMessage(e);
});

/**
 * Display a small message indicating that the text has been
 * succesfully copied
 * @param  {number} timeOut The previous timeout number, in case of waiting for it to happen.
 * @param  {Event} e The 'click' event.
 * @return {number}      The new timeout number
 */
function copiedMessage(e) {
    copyMessage.style.display = "block";
    copyMessage.style.opacity = "1";
    copyMessage.style.top = `${e.pageY + 30}px`;
    copyMessage.style.left = `${
        e.pageX - parseInt(getComputedStyle(copyMessage).width) / 2
    }px`;
    return vanishMessage(copyMessage, copyTimeOut);
}

/**
 * Vanish the message with a small transition.
 * @param  {Element} messageContainer The container of the message to vanish
 * @param  {number} timeOut The previous timeout number, in case of not completing the last one.
 * @return {number}      The new timeout number
 */
function vanishMessage(messageContainer, timeOut) {
    // In case of already running a previous setTimeout, clear it
    clearTimeout(timeOut);
    return setTimeout(() => {
        messageContainer.style.transition =
            " visibility 0s, opacity 0.5s linear";
        messageContainer.style.opacity = "0";
        setTimeout(() => {
            messageContainer.style.display = "none";
            messageContainer.style.transition = "opacity 0s";
        }, 500);
    }, 1000);
}

/**
 * Checks for wrong input in the input container
 * If there would be, disables the buttons
 * Also, an small fixbug for Firefox
 * @param  {Event} e The input event
 */
function checkWrongInput(e) {
    // Solution for contentEditable in Mozilla Firefox for :empty pseudoelement
    if (e.target.innerHTML === "<br>" || e.target.innerHTML === "") {
        e.target.innerHTML = "";
        btnDecrypt.disabled = false;
        btnEncrypt.disabled = false;
        return;
    }
    // In case of writing something not valid for encrypting, disables the encrypt and decrypt buttons
    let disabled =
        e.target.textContent
            .normalize("NFD")
            .replace(/[\u0300-\u036fA-Z]/g, "") != e.target.textContent;
    btnDecrypt.disabled = disabled;
    btnEncrypt.disabled = disabled;
}

divEncryptor.addEventListener("input", checkWrongInput);

/**
 * Checks if the input container is empty. Show a message if its empty
 * @return {boolean}      Whether the input is empty or not
 */
function checkEmptyContent() {
    if (divEncryptor.textContent.trim() !== "") return false;
    showSuccesfulMessage(document.querySelector(".message--content-empty"));
    return true;
}

/**
 * Show the message with a small transition in top of the page
 * @param  {Element} messageContainer The container of the message to show
 */
function showSuccesfulMessage(messageContainer) {
    new Promise(resolve => {
        messageContainer.style.display = "block";
        setTimeout(()=> resolve(),50);
    }).then(() => {
        messageContainer.style.top = "20px";
        messageContainer.style.left = `${
            window.innerWidth / 2 -
            parseInt(getComputedStyle(messageContainer).width) / 2
        }px`;
    });
    rollUpMessage(messageContainer).then(() => {
        setTimeout(()=> messageContainer.style.display = "none",500);
    });
}

/**
 * Hide the message with a small transition
 * @param  {Element} messageContainer The container of the message to hide
 */
function rollUpMessage(messageContainer) {
    return new Promise(resolve => {
        setTimeout(() => {
            messageContainer.style.top = "-100px";
            resolve();
        }, 2500);
    });
}
