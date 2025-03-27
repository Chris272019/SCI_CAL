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
        this.cursorPosition = 0;
        this.calculationHistory = [];
        
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
            this.cursorPosition = 1;
            this.formula.textContent = this.currentValue;
        } else {
            // Check if we need to add multiplication
            const beforeCursor = this.currentValue.slice(0, this.cursorPosition);
            const lastChar = beforeCursor[beforeCursor.length - 1];
            
            // If the last character is a closing parenthesis, add multiplication
            if (lastChar === ')') {
                this.currentValue = this.currentValue.slice(0, this.cursorPosition) + 
                                  '×' + number + 
                                  this.currentValue.slice(this.cursorPosition);
                this.cursorPosition += 2; // Move cursor after the number
            } else {
                // Insert number at cursor position
                this.currentValue = this.currentValue.slice(0, this.cursorPosition) + 
                                  number + 
                                  this.currentValue.slice(this.cursorPosition);
                this.cursorPosition++;
            }
            this.formula.textContent = this.currentValue;
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
                this.operationHistory[this.operationHistory.length - 1] = value;
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
            case 'history':
                this.toggleHistory();
                break;
            case 'clear-history':
                this.clearHistory();
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
            // If current value is '0', replace it with the opening parenthesis
            if (this.currentValue === '0') {
                this.currentValue = '(';
                this.cursorPosition = 1;
            } else {
                // Check if we need to add multiplication
                const beforeCursor = this.currentValue.slice(0, this.cursorPosition);
                const lastChar = beforeCursor[beforeCursor.length - 1];
                
                // If the last character is a number or closing parenthesis, add multiplication
                if (lastChar && !['+', '-', '×', '÷', '%', '('].includes(lastChar)) {
                    this.currentValue = this.currentValue.slice(0, this.cursorPosition) + 
                                      '×(' + 
                                      this.currentValue.slice(this.cursorPosition);
                    this.cursorPosition += 2; // Move cursor after the opening parenthesis
                } else {
                    // Insert opening parenthesis at cursor position
                    this.currentValue = this.currentValue.slice(0, this.cursorPosition) + 
                                      '(' + 
                                      this.currentValue.slice(this.cursorPosition);
                    this.cursorPosition++;
                }
            }
        } else if (paren === ')') {
            if (this.parenthesesCount > 0) {
                this.parenthesesCount--;
                // Insert closing parenthesis at cursor position
                this.currentValue = this.currentValue.slice(0, this.cursorPosition) + 
                                  ')' + 
                                  this.currentValue.slice(this.cursorPosition);
                this.cursorPosition++;
            } else {
                return; // Don't add closing parenthesis if there's no matching opening
            }
        }
        this.formula.textContent = this.currentValue;
        this.updateDisplay();
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
                this.cursorPosition = this.currentValue.length;
                this.formula.textContent = `${operationSymbol}(${current}) = ${result}`;
                this.lastAnswer = result;
                this.updateDisplay();
            }
        } catch (error) {
            this.handleError(error);
        }
    }

    handleOperator(operator) {
        // If there's no last operation, store the current value
        if (!this.lastOperation) {
            this.lastNumber = parseFloat(this.currentValue);
        }
        
        // Store the current operation
        this.lastOperation = operator;
        
        // Insert operator at cursor position
        this.currentValue = this.currentValue.slice(0, this.cursorPosition) + 
                          operator + 
                          this.currentValue.slice(this.cursorPosition);
        
        // Move cursor after the operator
        this.cursorPosition++;
        
        // Update the formula display
        this.formula.textContent = this.currentValue;
        this.updateDisplay();
    }

    calculate() {
        let result;

        try {
            if (this.parenthesesCount > 0) {
                this.handleError(new Error('Unclosed parentheses'));
                return;
            }

            // Evaluate the expression
            try {
                // Replace calculator symbols with JavaScript operators
                const expression = this.currentValue
                    .replace(/×/g, '*')
                    .replace(/÷/g, '/')
                    .replace(/%/g, '%');
                
                // Evaluate the expression including parentheses
                result = eval(expression);
                
                // Check if result is valid
                if (isNaN(result) || !isFinite(result)) {
                    throw new Error('Invalid calculation');
                }
            } catch (e) {
                throw new Error('Invalid expression');
            }

            // Add to calculation history
            this.addToHistory(this.currentValue, result);

            // Update the formula to show the complete calculation
            this.formula.textContent = `${this.currentValue} = ${result}`;
            
            // Update the current value and cursor
            this.currentValue = result.toString();
            this.cursorPosition = this.currentValue.length;
            
            // Store the result as last answer
            this.lastAnswer = result;
            
            // Reset operation state
            this.lastOperation = null;
            this.lastNumber = null;
            
            this.updateDisplay();
        } catch (error) {
            this.handleError(error);
        }
    }

    addToHistory(formula, result) {
        this.calculationHistory.unshift({
            formula: formula,
            result: result,
            timestamp: new Date()
        });
        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        const historyList = document.querySelector('.history-list');
        const keypad = document.querySelector('.keypad');
        historyList.innerHTML = '';
        
        this.calculationHistory.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            historyItem.innerHTML = `
                <div class="history-formula">${item.formula}</div>
                <div class="history-result">${item.result}</div>
            `;
            
            historyItem.addEventListener('click', () => {
                this.currentValue = item.result.toString();
                this.cursorPosition = this.currentValue.length;
                this.formula.textContent = item.formula;
                this.updateDisplay();
                this.toggleHistory();
            });
            historyList.appendChild(historyItem);
        });
    }

    toggleHistory() {
        const historyView = document.querySelector('.history-view');
        const keypad = document.querySelector('.keypad');
        const display = document.querySelector('.display-container');
        const historyBtn = document.querySelector('.history-btn');
        
        if (historyView.classList.contains('show')) {
            // Hide history view
            historyView.classList.remove('show');
            keypad.classList.remove('hidden');
            display.style.display = 'block';
            historyBtn.textContent = 'History';
        } else {
            // Show history view
            historyView.classList.add('show');
            keypad.classList.add('hidden');
            display.style.display = 'none';
            historyBtn.textContent = 'Return';
        }
    }

    clearHistory() {
        this.calculationHistory = [];
        this.updateHistoryDisplay();
    }

    handleError(error) {
        this.currentValue = 'Error';
        this.cursorPosition = 0;
        this.operationHistory = ['Error'];
        this.formula.textContent = 'Error';
        this.updateDisplay();
        console.error('Calculation error:', error);
    }

    clear() {
        if (this.currentValue.length > 1 && this.cursorPosition > 0) {
            // Remove character before cursor position
            this.currentValue = this.currentValue.slice(0, this.cursorPosition - 1) + 
                              this.currentValue.slice(this.cursorPosition);
            // Move cursor back one position
            this.cursorPosition--;
            this.formula.textContent = this.currentValue;
        } else if (this.currentValue.length === 1) {
            // If only one character remains, reset to '0'
            this.currentValue = '0';
            this.cursorPosition = 0;
            this.formula.textContent = '';
        }
        this.updateDisplay();
    }

    allClear() {
        this.currentValue = '0';
        this.cursorPosition = 0;
        this.formula.textContent = '';
        this.lastOperation = null;
        this.lastNumber = null;
        this.parenthesesCount = 0;
        this.memory = 0;
        this.updateDisplay();
    }

    memoryClear() {
        this.memory = 0;
        this.formula.textContent = 'MC';
    }

    memoryRecall() {
        this.currentValue = this.memory.toString();
        this.formula.textContent = `MR = ${this.memory}`;
        this.updateDisplay();
    }

    memoryAdd() {
        this.memory = this.add(this.memory, parseFloat(this.currentValue));
        this.formula.textContent = `M+ ${this.currentValue}`;
    }

    memorySubtract() {
        this.memory = this.subtract(this.memory, parseFloat(this.currentValue));
        this.formula.textContent = `M- ${this.currentValue}`;
    }

    useLastAnswer() {
        this.currentValue = this.lastAnswer.toString();
        this.formula.textContent = `Ans = ${this.lastAnswer}`;
        this.updateDisplay();
    }

    moveCursorLeft() {
        if (this.cursorPosition > 0) {
            this.cursorPosition--;
            this.updateDisplay();
        }
    }

    moveCursorRight() {
        if (this.cursorPosition < this.currentValue.length) {
            this.cursorPosition++;
            this.updateDisplay();
        }
    }

    updateDisplay() {
        // Add cursor indicator
        const displayValue = this.currentValue;
        const beforeCursor = displayValue.slice(0, this.cursorPosition);
        const afterCursor = displayValue.slice(this.cursorPosition);
        this.display.textContent = beforeCursor + '|' + afterCursor;
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


