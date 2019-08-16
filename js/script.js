function f() {
    const inputElem = document.getElementById('input-output-block');
    const handleBlock = document.getElementById('handle-block');
    const signButton = document.getElementsByClassName('sign');
    const deleteButton = document.getElementById('delete-input-val');
    const clearButton = document.getElementById('button-clear');

    let setFocusCaretOnInput = () => {
        inputElem.focus();
        inputElem.selectionStart = inputElem.value.length;
    };
    let getResult = (value) => {
        let resultStringFormatting = (value) => {
            let checkTrimNeeded = (value) => {
                let inputLengthCheck = /\d+\.\d{7,}/g;
                return inputLengthCheck.test(value);
            };
            let trim = (value) => {
                if (checkTrimNeeded(value)) {
                    return /\d+\.\d{0,7}/g.exec(value)[0];
                } else {
                    return value;
                }
            };
            return trim(value);
        };

        let stringTrimToEval = (str) => {
            if (/[\/*+-.]$/g.test(str)) {
                return str.slice(0, -1);
            } else {
                return str;
            }
        };
        inputElem.value = resultStringFormatting(eval(stringTrimToEval(value)));
    };
    let validator = (stringToValidate) => {
        let str = stringToValidate ? inputElem.value + stringToValidate : inputElem.value;
        let stringValidate = (inputVal) => {
            // validate /*+. sign after /*+-. sign example--> (-+)(**)
            return (!(/([\/*+-.])([\/*+.])/g).test(inputVal))
                // validate . sign at beginning of line and . sign after /*+. signs example--> (line begin .)(+.)(..)
                && (!(/(^|[\/*+-.])\./g).test(inputVal))
                // validate - sign after . sign example--> (.-)
                && (!(/\.-/g).test(inputVal))
                // validate . sign repeating two times in one number example--> (2.1.3)(.5.)
                && (!(/\.\d+\./g).test(inputVal))
                // validate - sign consecutive repeat example--> (---)
                && (!(/--/g).test(inputVal))
                // validate - sign two times repeat consecutive after /*+- signs example--> (+--)
                && (!(/[\/*+-]--/g).test(inputVal))
        };

        return stringValidate(str);
    };

    let keyboardClickHandler = (e) => {
        for (let i = 0; i < signButton.length; i++) {
            if (signButton[i].textContent === e.key) {
                signButton[i].click();
            }
        }
        e.key === 'Enter' || e.key === '=' ? getResult(inputElem.value) : null;
        e.key === 'Backspace' ? deleteButton.click() : null;
        e.key === 'Delete' ? clearButton.click() : null;
    };

    let handleBlockClickHandler = (target) => {
        if ((target.classList.contains('sign')) && validator(target.textContent)) {
            inputElem.value += target.textContent;
        } else if (target.classList.contains('delete-input-val')) {
            inputElem.value = inputElem.value.slice(0, -1);
        } else if (target.getAttribute('id') === 'button-clear') {
            inputElem.value = '';
        } else if (target.getAttribute('id') === 'button-equally') {
            getResult(inputElem.value);
        }
    };

    let clickHandler = (e) => {
        let target = e.target;
        e.preventDefault();

        e.key ? keyboardClickHandler(e) : handleBlockClickHandler(target);
    };

    handleBlock.addEventListener('click', (e) => {
        clickHandler(e);
        setFocusCaretOnInput();
    });
    inputElem.addEventListener('keydown', (e) => {
        clickHandler(e);
        setFocusCaretOnInput();
    });
}

f();





