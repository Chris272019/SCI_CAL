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
  const [isInverseMode, setIsInverseMode] = useState(false);

  const handleNumber = (number) => {
    if (display === '0' || lastAnswer !== null) {
      setDisplay(number + '|');
      setFormula(number);
      setLastAnswer(null);
      setCursorPosition(1);
    } else if (currentOperation !== '') {
      // If we're in a scientific function, insert the number inside parentheses
      if (lastOperation && ['sin', 'cos', 'tan', 'log', 'ln'].includes(lastOperation)) {
        const displayWithoutCursor = display.replace('|', '');
        const parts = displayWithoutCursor.split('(');
        const newDisplay = parts[0] + '(' + number + '|' + parts[1];
        setDisplay(newDisplay);
        setFormula(prev => prev + number);
        setCursorPosition(parts[0].length + 1);
      } else {
        const newDisplay = formula + number + '|';
        setDisplay(newDisplay);
        setFormula(prev => prev + number);
        setCursorPosition(newDisplay.length - 1);
      }
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
    const displayWithoutCursor = display.replace('|', '');
    const currentValue = displayWithoutCursor === '0' ? '' : displayWithoutCursor;
    
    if (lastOperation && ['sin', 'cos', 'tan', 'log', 'ln'].includes(lastOperation)) {
      // Handle scientific operations
      let inputNumber;
      if (isInverseMode) {
        // For inverse operations, split by the inverse symbol
        const operationSymbol = lastOperation === 'sin' ? 'sin⁻¹' :
                               lastOperation === 'cos' ? 'cos⁻¹' :
                               lastOperation === 'tan' ? 'tan⁻¹' :
                               lastOperation === 'log' ? '10ˣ' :
                               lastOperation === 'ln' ? 'eˣ' : lastOperation;
        const parts = formula.split(operationSymbol);
        inputNumber = parseFloat(parts[1].replace(/[()]/g, ''));
      } else {
        const parts = formula.split(lastOperation);
        inputNumber = parseFloat(parts[1].replace(/[()]/g, ''));
      }

      let result;
      let operationSymbol;

      // Calculate based on the last operation
      switch (lastOperation) {
        case 'sin':
          if (isInverseMode) {
            if (inputNumber < -1 || inputNumber > 1) {
              setDisplay('Error|');
              setFormula('Error: sin⁻¹(x) requires -1 ≤ x ≤ 1');
              setCursorPosition(5);
              return;
            }
            result = isRadMode ? Math.asin(inputNumber) : Math.asin(inputNumber) * 180 / Math.PI;
            operationSymbol = 'sin⁻¹';
          } else {
            result = isRadMode ? Math.sin(inputNumber) : Math.sin(inputNumber * Math.PI / 180);
            operationSymbol = 'sin';
          }
          break;
        case 'cos':
          if (isInverseMode) {
            if (inputNumber < -1 || inputNumber > 1) {
              setDisplay('Error|');
              setFormula('Error: cos⁻¹(x) requires -1 ≤ x ≤ 1');
              setCursorPosition(5);
              return;
            }
            result = isRadMode ? Math.acos(inputNumber) : Math.acos(inputNumber) * 180 / Math.PI;
            operationSymbol = 'cos⁻¹';
          } else {
            result = isRadMode ? Math.cos(inputNumber) : Math.cos(inputNumber * Math.PI / 180);
            operationSymbol = 'cos';
          }
          break;
        case 'tan':
          if (isInverseMode) {
            result = isRadMode ? Math.atan(inputNumber) : Math.atan(inputNumber) * 180 / Math.PI;
            operationSymbol = 'tan⁻¹';
          } else {
            result = isRadMode ? Math.tan(inputNumber) : Math.tan(inputNumber * Math.PI / 180);
            operationSymbol = 'tan';
          }
          break;
        case 'log':
          if (isInverseMode) {
            result = Math.pow(10, inputNumber);
            operationSymbol = '10ˣ';
          } else {
            result = Math.log10(inputNumber);
            operationSymbol = 'log';
          }
          break;
        case 'ln':
          if (isInverseMode) {
            result = Math.exp(inputNumber);
            operationSymbol = 'eˣ';
          } else {
            result = Math.log(inputNumber);
            operationSymbol = 'ln';
          }
          break;
      }

      // Multiply the result by the multiplier
      result = result * lastNumber;
      
      // Round the result to avoid floating-point precision errors
      if (Math.abs(result) < 1e-10) {
        result = 0;
      } else if (Math.abs(result) > 1e10) {
        result = result.toExponential(6);
      } else {
        result = Number(result.toFixed(10));
      }
      
      const fullOperation = lastNumber !== 1 
        ? `${lastNumber}${operationSymbol}(${inputNumber}) = ${result}`
        : `${operationSymbol}(${inputNumber}) = ${result}`;
      
      setDisplay(result.toString() + '|');
      setFormula(fullOperation);
      addToHistory(fullOperation);
      setLastAnswer(result);
      setLastOperation(null);
      setLastNumber(null);
      setCurrentOperation('');
      setCursorPosition(result.toString().length);
    } else {
      // Handle regular arithmetic operations
      try {
        // Replace adjacent parentheses with multiplication
        let expression = formula
          .replace(/×/g, '*')
          .replace(/÷/g, '/')
          .replace(/%/g, '%')
          .replace(/\)\(/g, ')*('); // Add multiplication between adjacent parentheses
        
        let result = eval(expression);
        
        if (isNaN(result) || !isFinite(result)) {
          setDisplay('Error|');
          setFormula('Error: Invalid calculation');
          setCursorPosition(5);
          return;
        }

        // Round the result to avoid floating-point precision errors
        if (Math.abs(result) < 1e-10) {
          result = 0;
        } else if (Math.abs(result) > 1e10) {
          result = result.toExponential(6);
        } else {
          result = Number(result.toFixed(10));
        }

        const fullOperation = `${formula} = ${result}`;
        setDisplay(result.toString() + '|');
        setFormula(fullOperation);
        addToHistory(fullOperation);
        setLastAnswer(result);
        setLastOperation(null);
        setLastNumber(null);
        setCurrentOperation('');
        setCursorPosition(result.toString().length);
      } catch (error) {
        setDisplay('Error|');
        setFormula('Error: Invalid expression');
        setCursorPosition(5);
      }
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
    const displayWithoutCursor = display.replace('|', '');
    const currentValue = displayWithoutCursor === '0' ? '' : displayWithoutCursor;
    
    // Check if there's a number before the function
    let multiplier = 1;
    
    // If there's a number before the function, extract it
    if (currentValue && !isNaN(currentValue)) {
      multiplier = parseFloat(currentValue);
    }
    
    // Store the multiplier and operation for later calculation
    setLastNumber(multiplier);
    setLastOperation(operation);
    setCurrentOperation(operation);
    
    // Update the display with the function
    const operationSymbol = isInverseMode ? 
      (operation === 'sin' ? 'sin⁻¹' : 
       operation === 'cos' ? 'cos⁻¹' : 
       operation === 'tan' ? 'tan⁻¹' : 
       operation === 'log' ? '10ˣ' : 
       operation === 'ln' ? 'eˣ' : operation) : operation;
    
    // Add parentheses for the input number
    const newDisplay = currentValue.slice(0, cursorPosition) + operationSymbol + '(' + '|' + ')' + currentValue.slice(cursorPosition);
    setDisplay(newDisplay);
    
    // Update formula with the multiplier and function
    const base = currentValue && !isNaN(currentValue) ? currentValue : '';
    setFormula(base + operationSymbol + '(');
    
    setCursorPosition(cursorPosition + operationSymbol.length + 1); // Move cursor inside parentheses
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

  const handleClearHistory = (indexToDelete) => {
    setHistory((prevHistory) =>
      prevHistory.filter((_, index) => index !== indexToDelete)
    );
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

  const handleNegative = () => {
    const displayWithoutCursor = display.replace('|', '');
    const currentValue = displayWithoutCursor === '0' ? '' : displayWithoutCursor;
    
    // If we're in a scientific function, handle the number inside parentheses
    if (lastOperation && ['sin', 'cos', 'tan', 'log', 'ln'].includes(lastOperation)) {
      const parts = currentValue.split('(');
      const numberPart = parts[1].split(')')[0];
      const newDisplay = parts[0] + '(' + '-' + numberPart + '|' + parts[1].slice(numberPart.length + 1);
      setDisplay(newDisplay);
      setFormula(prev => {
        const formulaParts = prev.split('(');
        return formulaParts[0] + '(' + '-' + formulaParts[1];
      });
      setCursorPosition(parts[0].length + 2); // Move cursor after the negative sign
    } else {
      // Find the last number in the current value
      const lastNumberMatch = currentValue.match(/-?\d+\.?\d*$/);
      if (lastNumberMatch) {
        const lastNumber = lastNumberMatch[0];
        // Always add a negative sign
        const newValue = currentValue.slice(0, -lastNumber.length) + '-' + lastNumber;
        const newDisplay = newValue + '|';
        setDisplay(newDisplay);
        setFormula(newValue);
        setCursorPosition(newValue.length);
      }
    }
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
      onNegative={handleNegative}
      formula={formula}
      display={display}
      showHistory={showHistory}
      history={history}
      historyButtonText={getHistoryButtonText()}
      isInverseMode={isInverseMode}
      onToggleInverse={() => setIsInverseMode(!isInverseMode)}
    />
  );
};

export default Calculator; 
