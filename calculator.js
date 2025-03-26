class Calculator {
    constructor() {
        this.display = document.querySelector('.result');
        this.formula = document.querySelector('.formula');
        this.currentValue = '0';
        this.memory = 0;
        this.lastOperation = null;
        this.lastNumber = null;
        this.isRadMode = false;
        this.operationHistory = [];
        this.lastAnswer = 0;
        this.parenthesesCount = 0;
        
        this.setupEventListeners();
        this.updateModeButtons();
    }

    // Helper math functions
    factorial(n) {
        if (n < 0) throw new Error('Factorial not defined for negative numbers');
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    power(base, exponent) {
        return Math.pow(base, exponent);
    }

    squareRoot(n) {
        if (n < 0) throw new Error('Cannot calculate square root of negative number');
        return Math.sqrt(n);
    }

    cubeRoot(n) {
        return Math.pow(n, 1/3);
    }

    sin(angle) {
        return Math.sin(this.isRadMode ? angle : angle * Math.PI / 180);
    }

    cos(angle) {
        return Math.cos(this.isRadMode ? angle : angle * Math.PI / 180);
    }

    tan(angle) {
        return Math.tan(this.isRadMode ? angle : angle * Math.PI / 180);
    }

    log10(n) {
        if (n <= 0) throw new Error('Logarithm not defined for non-positive numbers');
        return Math.log10(n);
    }

    ln(n) {
        if (n <= 0) throw new Error('Natural logarithm not defined for non-positive numbers');
        return Math.log(n);
    }

    exp(n) {
        return Math.exp(n);
    }

    abs(n) {
        return Math.abs(n);
    }

    add(a, b) {
        return a + b;
    }

    subtract(a, b) {
        return a - b;
    }

    multiply(a, b) {
        return a * b;
    }

    divide(a, b) {
        if (b === 0) throw new Error('Division by zero');
        return a / b;
    }

    mod(a, b) {
        if (b === 0) throw new Error('Modulo by zero');
        return a % b;
    }

    setupEventListeners() {
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.action;
                const value = button.textContent;

                if (action) {
                    this.handleAction(action);
                } else {
                    this.handleNumber(value);
                }
            });
        });
    }

    handleNumber(number) {
        if (this.currentValue === '0') {
            this.currentValue = number;
            this.updateFormula(number);
        } else {
            this.currentValue += number;
            this.updateFormula(number);
        }
        this.updateDisplay();
    }

    updateFormula(value) {
        if (this.operationHistory.length === 0) {
            this.operationHistory.push(value);
        } else {
            const lastOperation = this.operationHistory[this.operationHistory.length - 1];
            if (['+', '-', '×', '÷', '%'].includes(lastOperation)) {
                this.operationHistory.push(value);
            } else {
                this.operationHistory[this.operationHistory.length - 1] += value;
            }
        }
        this.formula.textContent = this.operationHistory.join(' ');
    }

    handleAction(action) {
        switch (action) {
            case 'clear':
                this.clear();
                break;
            case 'all-clear':
                this.allClear();
                break;
            case '=':
                this.calculate();
                break;
            case 'mc':
                this.memoryClear();
                break;
            case 'mr':
                this.memoryRecall();
                break;
            case 'm+':
                this.memoryAdd();
                break;
            case 'm-':
                this.memorySubtract();
                break;
            case 'ans':
                this.useLastAnswer();
                break;
            case 'left':
                this.moveCursorLeft();
                break;
            case 'right':
                this.moveCursorRight();
                break;
            case '(':
                this.handleParenthesis('(');
                break;
            case ')':
                this.handleParenthesis(')');
                break;
            case 'rad':
                this.setRadMode();
                break;
            case 'deg':
                this.setDegMode();
                break;
            default:
                if (['+', '-', '×', '÷', '%'].includes(action)) {
                    this.handleOperator(action);
                } else {
                    this.handleScientific(action);
                }
        }
    }

    handleParenthesis(paren) {
        if (paren === '(') {
            this.parenthesesCount++;
            this.operationHistory.push('(');
        } else if (paren === ')') {
            if (this.parenthesesCount > 0) {
                this.parenthesesCount--;
                this.operationHistory.push(')');
            } else {
                return; // Don't add closing parenthesis if there's no matching opening
            }
        }
        this.formula.textContent = this.operationHistory.join(' ');
    }

    handleScientific(operation) {
        const current = parseFloat(this.currentValue);
        let result;
        let operationSymbol;

        try {
            switch (operation) {
                case 'sin':
                    result = this.sin(current);
                    operationSymbol = 'sin';
                    break;
                case 'cos':
                    result = this.cos(current);
                    operationSymbol = 'cos';
                    break;
                case 'tan':
                    result = this.tan(current);
                    operationSymbol = 'tan';
                    break;
                case 'log':
                    result = this.log10(current);
                    operationSymbol = 'log';
                    break;
                case 'ln':
                    result = this.ln(current);
                    operationSymbol = 'ln';
                    break;
                case 'sqrt':
                    result = this.squareRoot(current);
                    operationSymbol = '√';
                    break;
                case 'x2':
                    result = this.power(current, 2);
                    operationSymbol = 'x²';
                    break;
                case 'x3':
                    result = this.power(current, 3);
                    operationSymbol = 'x³';
                    break;
                case 'x-1':
                    result = this.divide(1, current);
                    operationSymbol = 'x⁻¹';
                    break;
                case 'cube-root':
                    result = this.cubeRoot(current);
                    operationSymbol = '∛';
                    break;
                case '10x':
                    result = this.power(10, current);
                    operationSymbol = '10ˣ';
                    break;
                case 'ex':
                    result = this.exp(current);
                    operationSymbol = 'eˣ';
                    break;
                case 'pi':
                    result = Math.PI;
                    operationSymbol = 'π';
                    break;
                case 'e':
                    result = Math.E;
                    operationSymbol = 'e';
                    break;
                case 'factorial':
                    result = this.factorial(current);
                    operationSymbol = 'x!';
                    break;
                case 'abs':
                    result = this.abs(current);
                    operationSymbol = '|x|';
                    break;
            }

            if (result !== undefined) {
                this.currentValue = result.toString();
                this.operationHistory = [`${operationSymbol}(${current})`, '=', result.toString()];
                this.formula.textContent = this.operationHistory.join(' ');
                this.lastAnswer = result;
                this.updateDisplay();
            }
        } catch (error) {
            this.handleError(error);
        }
    }

    handleOperator(operator) {
        this.lastNumber = parseFloat(this.currentValue);
        this.lastOperation = operator;
        this.currentValue = '0';
        this.operationHistory.push(operator);
        this.formula.textContent = this.operationHistory.join(' ');
        this.updateDisplay();
    }

    calculate() {
        if (this.lastOperation && this.lastNumber !== null) {
            const current = parseFloat(this.currentValue);
            let result;

            try {
                if (this.parenthesesCount > 0) {
                    this.handleError(new Error('Unclosed parentheses'));
                    return;
                }

                switch (this.lastOperation) {
                    case '+':
                        result = this.add(this.lastNumber, current);
                        break;
                    case '-':
                        result = this.subtract(this.lastNumber, current);
                        break;
                    case '×':
                        result = this.multiply(this.lastNumber, current);
                        break;
                    case '÷':
                        result = this.divide(this.lastNumber, current);
                        break;
                    case '%':
                        result = this.mod(this.lastNumber, current);
                        break;
                }

                this.currentValue = result.toString();
                this.operationHistory.push('=');
                this.operationHistory.push(result.toString());
                this.formula.textContent = this.operationHistory.join(' ');
                this.lastAnswer = result;
                this.lastOperation = null;
                this.lastNumber = null;
                this.updateDisplay();
            } catch (error) {
                this.handleError(error);
            }
        }
    }

    handleError(error) {
        this.currentValue = 'Error';
        this.operationHistory = ['Error'];
        this.formula.textContent = 'Error';
        this.updateDisplay();
        console.error('Calculation error:', error);
    }

    clear() {
        this.currentValue = '0';
        this.operationHistory = [];
        this.formula.textContent = '';
        this.lastOperation = null;
        this.lastNumber = null;
        this.parenthesesCount = 0;
        this.updateDisplay();
    }

    allClear() {
        this.clear();
        this.memory = 0;
    }

    memoryClear() {
        this.memory = 0;
        this.operationHistory = ['MC'];
        this.formula.textContent = 'MC';
    }

    memoryRecall() {
        this.currentValue = this.memory.toString();
        this.operationHistory = [`MR = ${this.memory}`];
        this.formula.textContent = `MR = ${this.memory}`;
        this.updateDisplay();
    }

    memoryAdd() {
        this.memory = this.add(this.memory, parseFloat(this.currentValue));
        this.operationHistory = [`M+ ${this.currentValue}`];
        this.formula.textContent = `M+ ${this.currentValue}`;
    }

    memorySubtract() {
        this.memory = this.subtract(this.memory, parseFloat(this.currentValue));
        this.operationHistory = [`M- ${this.currentValue}`];
        this.formula.textContent = `M- ${this.currentValue}`;
    }

    useLastAnswer() {
        this.currentValue = this.lastAnswer.toString();
        this.operationHistory = [`Ans = ${this.lastAnswer}`];
        this.formula.textContent = `Ans = ${this.lastAnswer}`;
        this.updateDisplay();
    }

    moveCursorLeft() {
        if (this.currentValue.length > 1) {
            this.currentValue = this.currentValue.slice(0, -1);
            this.updateDisplay();
        }
    }

    moveCursorRight() {
        // Implement cursor movement if needed
    }

    updateDisplay() {
        this.display.textContent = this.currentValue;
    }

    setRadMode() {
        this.isRadMode = true;
        this.updateModeButtons();
        this.operationHistory = ['RAD'];
        this.formula.textContent = 'RAD';
        
        // Recalculate last answer if it was a trigonometric function
        if (this.lastAnswer !== 0) {
            const lastOperation = this.operationHistory[0];
            if (['sin', 'cos', 'tan'].includes(lastOperation)) {
                const angle = parseFloat(this.operationHistory[0].match(/\((.*?)\)/)[1]);
                let result;
                switch (lastOperation) {
                    case 'sin':
                        result = this.sin(angle);
                        break;
                    case 'cos':
                        result = this.cos(angle);
                        break;
                    case 'tan':
                        result = this.tan(angle);
                        break;
                }
                this.currentValue = result.toString();
                this.operationHistory = [`${lastOperation}(${angle})`, '=', result.toString()];
                this.formula.textContent = this.operationHistory.join(' ');
                this.lastAnswer = result;
                this.updateDisplay();
            }
        }
    }

    setDegMode() {
        this.isRadMode = false;
        this.updateModeButtons();
        this.operationHistory = ['DEG'];
        this.formula.textContent = 'DEG';
        
        // Recalculate last answer if it was a trigonometric function
        if (this.lastAnswer !== 0) {
            const lastOperation = this.operationHistory[0];
            if (['sin', 'cos', 'tan'].includes(lastOperation)) {
                const angle = parseFloat(this.operationHistory[0].match(/\((.*?)\)/)[1]);
                let result;
                switch (lastOperation) {
                    case 'sin':
                        result = this.sin(angle);
                        break;
                    case 'cos':
                        result = this.cos(angle);
                        break;
                    case 'tan':
                        result = this.tan(angle);
                        break;
                }
                this.currentValue = result.toString();
                this.operationHistory = [`${lastOperation}(${angle})`, '=', result.toString()];
                this.formula.textContent = this.operationHistory.join(' ');
                this.lastAnswer = result;
                this.updateDisplay();
            }
        }
    }

    updateModeButtons() {
        const radButton = document.querySelector('[data-action="rad"]');
        const degButton = document.querySelector('[data-action="deg"]');
        
        if (this.isRadMode) {
            radButton.style.backgroundColor = '#4CAF50';
            radButton.style.color = 'white';
            degButton.style.backgroundColor = '#d0d0d0';
            degButton.style.color = '#333';
        } else {
            degButton.style.backgroundColor = '#4CAF50';
            degButton.style.color = 'white';
            radButton.style.backgroundColor = '#d0d0d0';
            radButton.style.color = '#333';
        }
    }
}

// Initialize the calculator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
}); 