const elements = {
    displayResult: document.getElementById("display-result"),
    displayHint: document.getElementById("display-hint"),
    alertMessage: document.getElementById("alert-message"),
    clear: document.querySelector(".clear"),
    dec: document.querySelector(".dec"),
    del: document.querySelector(".del"),
    equal: document.querySelector(".equal"),
    board: document.getElementById("board"),
    boardNum1: document.querySelector(".num1"),
    boardNum2: document.querySelector(".num2"),
    boardOp: document.querySelector(".board-op"),
    boardCurrOp: document.querySelector(".curr-op"),
};

const calculator = {
    result: 0,
    activeFirstNumber: true,
    activeSecondNumber: false,
    firstNumber: null,
    secondNumber: null,
    operator: null,
    previousOperator: null,
    displayedValue: "0",
    displayedHintValue: "0",
    equalMode: false,

    equalClick: function() {
        if (this.firstNumber === null || this.secondNumber === null) return
        this.equalMode = true;
        this.result = this.doMath(this.previousOperator);

        this.displayedValue = this.result;
        this.displayedHintValue = this.buildHint();

        this.activeFirstNumber = false;
        this.activeSecondNumber = true;
    },
    doMath: function(op) {
        let result = 0;

        let num1 = this.firstNumber;
        let num2 = this.secondNumber;

        if (num2 === null && this.equalMode) {
            num2 = num1;
        }

        num1 = parseFloat(Number(num1).toFixed(5));
        num2 = parseFloat(Number(num2).toFixed(5));

        switch (op) {
            case "+" :
                result = num1 + num2;
                break;
            case "-" :
                result = num1 - num2;
                break;
            case "*" :
                result = num1 * num2;
                break;
            case "÷" : // "alt 0247"
                if (num2 === 0){
                    displayMessage("Oops, you did it again... divide by 0 is a no no...");
                    break;
                }
                result = num1 / num2;
                break;
            default:
                throw new Error('Unknown operator' + op);
        }
        return result;

    },
    manageNumberSize: function(num) {
        // my attempt at preventing crazy number sizes
        if (num.length > 10) {
            num = num.slice(0, 10);
            displayMessage("Slow down. This calculator has a limit")
            return num;
        }
        return num;
    },
    setOperator: function(op) {
        // We exit since we have no numbers to operate on
        if (this.firstNumber === null) return;

        // Clean Hanging Decimals
        if (this.activeFirstNumber){
            if (this.firstNumber[this.firstNumber.length - 1] === ".")  {
                this.firstNumber = this.firstNumber.slice(0,-1)
                this.displayedValue = this.firstNumber;
            }
        }
        if (this.activeSecondNumber && this.secondNumber === null){
            this.previousOperator = op;
            this.displayedHintValue = this.buildHint();
            return;
        } else if (this.activeSecondNumber){
            if (this.secondNumber[this.secondNumber.length - 1] === ".")  {
                this.secondNumber = this.secondNumber.slice(0,-1)
                this.displayedValue = this.secondNumber;
            }
        }

        if (this.operator === null){
            this.operator = op;
            this.previousOperator = op;
            console.log(this.operator)
            console.log(this.previousOperator)

        } else {
            this.operator = this.previousOperator;
            this.previousOperator = op;
            console.log(this.operator)
            console.log(this.previousOperator)
        }

        if (this.secondNumber === null) {
            this.displayedValue = this.firstNumber;
            this.displayedHintValue = this.buildHint();
            this.activeFirstNumber = false
            this.activeSecondNumber = true

            return;
        }

        if (this.operator !== null){
            if (this.equalMode) {
                this.equalMode = false;
                this.operator = op;
                this.firstNumber = this.result;
                this.secondNumber = null;
                this.displayedValue = this.firstNumber;
                this.displayedHintValue = this.buildHint();
            } else {
                let result = this.doMath(this.operator);
                this.secondNumber = null;
                this.firstNumber = result;
                this.displayedValue = this.firstNumber;
                this.displayedHintValue = this.buildHint();

                this.activeFirstNumber = false;
                this.activeSecondNumber = true;
            }
        } else {
            this.displayedHintValue = this.buildHint();
            this.activeFirstNumber = false;
            this.activeSecondNumber = true;
        }
    },
    buildHint: function() {
        let temp = this.firstNumber
        if (this.operator !== null) {
            temp += this.previousOperator
        }
        if (this.secondNumber !== null) {
            temp += this.secondNumber
        }
        if (this.equalMode) {
            temp += "=";
            //this.equalMode =false;
        }
        return temp;
    },
    reset: function() {
        this.result = 0;
        this.activeFirstNumber = true;
        this.activeSecondNumber = false;
        this.firstNumber = null;
        this.secondNumber = null;
        this.operator = null;
        this.previousOperator = null;
        this.displayedValue = "0";
        this.displayedHintValue = "0";
        this.equalMode = false;

    },
    updateNumber: function(number) {
        if (this.equalMode) {
            let saveOp = this.operator;
            this.reset();
            this.operator = saveOp;
            this.previousOperator = saveOp;
        }
        if (this.activeFirstNumber) {
            if (this.firstNumber === null || this.firstNumber === "0") {
                this.firstNumber = number;
            } else {
                this.firstNumber += number;
                this.firstNumber = parseFloat(Number(this.firstNumber).toFixed(5)).toString();
                this.firstNumber = this.manageNumberSize(this.firstNumber);
            }
            this.displayedValue = this.firstNumber;
        }
        if (this.activeSecondNumber) {
            if (this.secondNumber === null || this.secondNumber === "0") {
                this.secondNumber = number;
            } else {
                this.secondNumber += number;
                this.secondNumber = parseFloat(Number(this.secondNumber).toFixed(5)).toString();
                this.secondNumber = this.manageNumberSize(this.secondNumber);
            }
            this.displayedValue = this.secondNumber;
        }
        this.displayedHintValue = this.buildHint();
    },
    setDecimal: function() {
        // Only allow one decimal
        let decimal = "."
        if (this.activeFirstNumber) {
            if (this.firstNumber !== null) {
                if (this.firstNumber.includes(".")) return;
            }

            if (this.firstNumber === null) {
                this.firstNumber = "0" + decimal;
            } else {
                this.firstNumber += decimal;
            }

            this.displayedValue = this.firstNumber;
            this.displayedHintValue = this.buildHint();
        }
        if (this.activeSecondNumber) {
            if (this.secondNumber !== null) {
                if (this.secondNumber.includes(".")) return;
            }

            if (this.secondNumber === null) {
                this.secondNumber = "0" + decimal;
            } else {
                this.secondNumber += decimal;
            }

            this.displayedValue = this.secondNumber;
            this.displayedHintValue = this.buildHint();
        }
    },
    deleteDigit: function() {
        if (this.equalMode) return;

        if (this.activeFirstNumber) {
            if (this.firstNumber === null) {
                return
            } else {
                if (this.firstNumber === "0") {
                    displayMessage("Nothing else to delete")
                    return
                }
                this.firstNumber = this.firstNumber.slice(0, -1);
                if (this.firstNumber === "") this.firstNumber  = "0";
            }
            this.displayedValue = this.firstNumber;
        }

        if (this.activeSecondNumber) {
            if (this.secondNumber === null) {
                return
            } else {
                if (this.secondNumber === "0") {
                    displayMessage("Nothing else to delete")
                    return
                }
                this.secondNumber = this.secondNumber.slice(0, -1);
                if (this.secondNumber === "") this.secondNumber  = "0";
            }
            this.displayedValue = this.secondNumber;
        }
        this.displayedHintValue = this.buildHint();
    },

    getDisplayedValue: function() { return this.displayedValue },
    getDisplayedHintValue: function()  { return this.displayedHintValue},
}
showState();


// Can be simplified more.. 3 ways of doing it
// Way #1
// elements.del.addEventListener("click", () => {
//     handleDeleteClick();
// })
// Way #2
//elements.del.addEventListener("click", () =>  handleDeleteClick());
// Way #3
elements.del.addEventListener("click", handleDeleteClick);
elements.clear.addEventListener("click", handleClearClick);
elements.dec.addEventListener("click",  handleDecimalClick);
elements.equal.addEventListener("click", handleEqualClick);
document.addEventListener('keypress', handleKeys);

const padNumber = document.querySelectorAll('.num');
for (const button of padNumber) {
    button.addEventListener("click", function () {
        handleNumberClick(this.dataset.num);
    })
}
const padOperand = document.querySelectorAll('.op');
for (const button of padOperand) {
    button.addEventListener("click", function (ev) {
        handleOperandClick(ev.target.dataset.op);
    })
}

function handleEqualClick() {
    calculator.equalClick();
    updateCalculatorDisplay();
}

function displayMessage(message) {
    elements.alertMessage.textContent = message;
    elements.alertMessage.style.backgroundColor = "pink";
    setTimeout(() => {
        elements.alertMessage.style.backgroundColor = "cornsilk";
    }, 3000)
}

function handleDeleteClick() {
    calculator.deleteDigit();
    updateCalculatorDisplay();
}

function handleOperandClick(op) {
    calculator.setOperator(op);
    updateCalculatorDisplay();
}

function updateCalculatorDisplay() {
    elements.displayResult.textContent = calculator.getDisplayedValue();
    elements.displayHint.textContent = calculator.getDisplayedHintValue();
    showState();
}

function handleNumberClick(num) {
    calculator.updateNumber(num);
    updateCalculatorDisplay();
}

function handleDecimalClick() {
    calculator.setDecimal()
    updateCalculatorDisplay();
}

function handleClearClick() {
    calculator.reset();
    updateCalculatorDisplay();
}

function handleKeys(e) {
    const key = e.key;
    const buttonSelector = `div[data-value="${key}"]`;
    const button = document.querySelector(buttonSelector);
    if (button) {
        button.click();
        button.classList.add('active');
        setTimeout(() => {
            button.classList.remove('active');
        }, 100);
    }
}

function showState() {
    console.log(`firstNumber : ${calculator.firstNumber}`);
    console.log(`secondNumber : ${calculator.secondNumber}`);
    console.log(`currentOperand : ${calculator.operator}`);

    elements.boardNum1.textContent = calculator.firstNumber;
    elements.boardOp.textContent = calculator.operator;
    elements.boardNum2.textContent = calculator.secondNumber;
    // elements.boardCurrOp.textContent = "";//currentOperand;
}
//349 374 345