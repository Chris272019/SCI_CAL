import React, { useState } from 'react';
import Keypad from './keypad';
import './Calculator.css';



const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [formula, setFormula] = useState('');
  const [memory, setMemory] = useState(0);
  const [isRadMode, setIsRadMode] = useState(false);
  const [lastOperation, setLastOperation] = useState(null);
  const [lastNumber, setLastNumber] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [lastAnswer, setLastAnswer] = useState(null);
  const [currentOperation, setCurrentOperation] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);

  const handleNumber = (number) => {
    if (display === '0' || lastAnswer !== null) {
      setDisplay(number + '|');
      setFormula(number);
      setLastAnswer(null);
      setCursorPosition(1);
    } else if (currentOperation !== '') {
      const newDisplay = formula + number + '|';
      setDisplay(newDisplay);
      setFormula(prev => prev + number);
      setCursorPosition(newDisplay.length - 1);
    } else {
      const displayWithoutCursor = display.replace('|', '');
      const newDisplay = (displayWithoutCursor === '0' ? '' : displayWithoutCursor.slice(0, cursorPosition)) + number + '|' + displayWithoutCursor.slice(cursorPosition);
      setDisplay(newDisplay);
      setFormula((formula === '0' ? '' : formula.slice(0, cursorPosition)) + number + formula.slice(cursorPosition));
      setCursorPosition(cursorPosition + 1);
    }
  };

  const handleOperator = (operator) => {
    const displayWithoutCursor = display.replace('|', '');
    const currentValue = displayWithoutCursor === '0' ? '' : displayWithoutCursor;
    
    // Just update the display and formula with the operator
    const newDisplay = currentValue.slice(0, cursorPosition) + operator + '|' + currentValue.slice(cursorPosition);
    setDisplay(newDisplay);
    setFormula(prev => (prev === '0' ? '' : prev.slice(0, cursorPosition)) + operator + prev.slice(cursorPosition));
    setLastOperation(operator);
    setCurrentOperation(operator);
    setCursorPosition(cursorPosition + 1);
  };

  const handleDirection = (direction) => {
    const displayWithoutCursor = display.replace('|', '');
    if (direction === 'left') {
      if (cursorPosition > 0) {
        const newDisplay = displayWithoutCursor.slice(0, cursorPosition - 1) + '|' + displayWithoutCursor.slice(cursorPosition - 1);
        setDisplay(newDisplay);
        setCursorPosition(cursorPosition - 1);
      }
    } else if (direction === 'right') {
      if (cursorPosition < displayWithoutCursor.length) {
        const newDisplay = displayWithoutCursor.slice(0, cursorPosition) + '|' + displayWithoutCursor.slice(cursorPosition);
        setDisplay(newDisplay);
        setCursorPosition(cursorPosition + 1);
      }
    }
  };

  const handleClear = () => {
    const displayWithoutCursor = display.replace('|', '');
    if (cursorPosition > 0) {
      const newDisplay = displayWithoutCursor.slice(0, cursorPosition - 1) + '|' + displayWithoutCursor.slice(cursorPosition);
      setDisplay(newDisplay);
      setFormula(formula.slice(0, cursorPosition - 1) + formula.slice(cursorPosition));
      setCursorPosition(cursorPosition - 1);
    }
  };

  const handleEqual = () => {
    // Evaluate the entire expression with proper precedence
    const expression = formula
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/%/g, '%');
    
    try {
      const result = eval(expression);
      const fullOperation = `${formula} = ${result}`;
      setDisplay(result.toString() + '|');
      setFormula(fullOperation);
      setLastAnswer(result);
      addToHistory(fullOperation);
      setLastOperation(null);
      setLastNumber(null);
      setCurrentOperation('');
      setCursorPosition(result.toString().length);
    } catch (error) {
      setDisplay('Error|');
      setFormula('Error');
      setLastOperation(null);
      setLastNumber(null);
      setCurrentOperation('');
      setCursorPosition(5);
    }
  };

  const handleAllClear = () => {
    setDisplay('0|');
    setFormula('');
    setLastOperation(null);
    setLastNumber(null);
    setCurrentOperation('');
    setCursorPosition(1);
    setMemory(0);
  };

  const handleMemory = (operation) => {
    const current = parseFloat(display.replace('|', ''));
    switch (operation) {
      case 'm+':
        setMemory(memory + current);
        setFormula(`M+ ${current}`);
        break;
      case 'm-':
        setMemory(memory - current);
        setFormula(`M- ${current}`);
        break;
      case 'mr':
        setDisplay(memory.toString() + '|');
        setFormula(`MR = ${memory}`);
        break;
      case 'mc':
        setMemory(0);
        setFormula('MC');
        break;
      default:
        break;
    }
  };

  const handleScientific = (operation) => {
    const current = parseFloat(display.replace('|', ''));
    let result;
    let operationSymbol;

    switch (operation) {
      case 'sin':
        result = isRadMode ? Math.sin(current) : Math.sin(current * Math.PI / 180);
        operationSymbol = 'sin';
        break;
      case 'cos':
        result = isRadMode ? Math.cos(current) : Math.cos(current * Math.PI / 180);
        operationSymbol = 'cos';
        break;
      case 'tan':
        result = isRadMode ? Math.tan(current) : Math.tan(current * Math.PI / 180);
        operationSymbol = 'tan';
        break;
      case 'asin':
        result = isRadMode ? Math.asin(current) : Math.asin(current) * 180 / Math.PI;
        operationSymbol = 'asin';
        break;
      case 'acos':
        result = isRadMode ? Math.acos(current) : Math.acos(current) * 180 / Math.PI;
        operationSymbol = 'acos';
        break;
      case 'atan':
        result = isRadMode ? Math.atan(current) : Math.atan(current) * 180 / Math.PI;
        operationSymbol = 'atan';
        break;
      case 'log':
        result = Math.log10(current);
        operationSymbol = 'log';
        break;
      case 'ln':
        result = Math.log(current);
        operationSymbol = 'ln';
        break;
      case 'sqrt':
        result = Math.sqrt(current);
        operationSymbol = '√';
        break;
      case 'x2':
        result = current * current;
        operationSymbol = 'x²';
        break;
      case 'x3':
        result = current * current * current;
        operationSymbol = 'x³';
        break;
      case 'x-1':
        result = 1 / current;
        operationSymbol = 'x⁻¹';
        break;
      case 'cube-root':
        result = Math.cbrt(current);
        operationSymbol = '∛';
        break;
      case '10x':
        result = Math.pow(10, current);
        operationSymbol = '10ˣ';
        break;
      case 'ex':
        result = Math.exp(current);
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
      case 'abs':
        result = Math.abs(current);
        operationSymbol = '|x|';
        break;
      case 'factorial':
        result = factorial(current);
        operationSymbol = 'x!';
        break;
      case 'floor':
        result = Math.floor(current);
        operationSymbol = '⌊x⌋';
        break;
      case 'ceil':
        result = Math.ceil(current);
        operationSymbol = '⌈x⌉';
        break;
      case 'round':
        result = Math.round(current);
        operationSymbol = 'round';
        break;
      case 'random':
        result = Math.random();
        operationSymbol = 'rand';
        break;
      case 'deg':
        result = current * 180 / Math.PI;
        operationSymbol = 'deg';
        break;
      case 'rad':
        result = current * Math.PI / 180;
        operationSymbol = 'rad';
        break;
      case 'square':
        result = current * current;
        operationSymbol = 'x²';
        break;
      case 'cube':
        result = current * current * current;
        operationSymbol = 'x³';
        break;
      case 'reciprocal':
        result = 1 / current;
        operationSymbol = 'x⁻¹';
        break;
      case 'percent':
        result = current / 100;
        operationSymbol = '%';
        break;
      case 'change-sign':
        result = -current;
        operationSymbol = '±';
        break;
      default:
        return;
    }

    const fullOperation = `${operationSymbol}(${current}) = ${result}`;
    setDisplay(result.toString() + '|');
    setFormula(fullOperation);
    addToHistory(fullOperation);
    setLastAnswer(result);
    setCursorPosition(result.toString().length);
  };

  const factorial = (n) => {
    if (n < 0) return NaN;
    if (n === 0) return 1;
    let result = 1;
    for (let i = 1; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const addToHistory = (calculation) => {
    setHistory(prev => [...prev, calculation]);
  };

  const handleHistory = () => {
    setShowHistory(!showHistory);
  };

  const getHistoryButtonText = () => {
    return showHistory ? 'Return' : 'History';
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleAns = () => {
    if (lastAnswer !== null) {
      setDisplay(lastAnswer.toString() + '|');
      setFormula(lastAnswer.toString());
      setLastAnswer(null);
      setCursorPosition(lastAnswer.toString().length);
      setLastOperation(null);
      setLastNumber(null);
      setCurrentOperation('');
    }
  };

  const handleParenthesis = (paren) => {
    const displayWithoutCursor = display.replace('|', '');
    let newDisplay;
    
    // Remove initial '0' if it exists and is the only digit
    const currentValue = displayWithoutCursor === '0' ? '' : displayWithoutCursor;
    
    // Check if we're adding a closing parenthesis and the next character is an opening parenthesis
    if (paren === ')' && currentValue[cursorPosition] === '(') {
      // Add multiplication operator between parentheses
      newDisplay = currentValue.slice(0, cursorPosition) + ')×(' + '|' + currentValue.slice(cursorPosition + 1);
      setFormula(prev => (prev === '0' ? '' : prev.slice(0, cursorPosition)) + ')×(' + prev.slice(cursorPosition + 1));
      setCursorPosition(cursorPosition + 3); // Move cursor after the multiplication operator
    } else {
      // Normal parenthesis insertion
      newDisplay = currentValue.slice(0, cursorPosition) + paren + '|' + currentValue.slice(cursorPosition);
      setFormula(prev => (prev === '0' ? '' : prev.slice(0, cursorPosition)) + paren + prev.slice(cursorPosition));
      setCursorPosition(cursorPosition + 1);
    }
    
    setDisplay(newDisplay);
  };

  const handlePercentage = () => {
    const current = parseFloat(display.replace('|', ''));
    const result = current / 100;
    const fullOperation = `${current}% = ${result}`;
    setDisplay(result.toString() + '|');
    setFormula(fullOperation);
    addToHistory(fullOperation);
  };

  return (
    <Keypad
      onNumber={handleNumber}
      onOperator={handleOperator}
      onEqual={handleEqual}
      onClear={handleClear}
      onMemory={handleMemory}
      onScientific={handleScientific}
      isRadMode={isRadMode}
      onToggleMode={() => setIsRadMode(!isRadMode)}
      onHistory={handleHistory}
      onClearHistory={handleClearHistory}
      onFunction={handleScientific}
      onAllClear={handleAllClear}
      onAns={handleAns}
      onDirection={handleDirection}
      onParenthesis={handleParenthesis}
      onPercentage={handlePercentage}
      formula={formula}
      display={display}
      showHistory={showHistory}
      history={history}
      historyButtonText={getHistoryButtonText()}
    />
  );
};

export default Calculator; 