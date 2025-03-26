import React, { useState } from 'react';
import Display from './Display';
import Keypad from './Keypad';
import './Calculator.css';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [formula, setFormula] = useState('');
  const [memory, setMemory] = useState(0);
  const [isRadMode, setIsRadMode] = useState(false);
  const [lastOperation, setLastOperation] = useState(null);
  const [lastNumber, setLastNumber] = useState(null);

  const handleNumber = (number) => {
    if (display === '0') {
      setDisplay(number);
      setFormula(number);
    } else {
      setDisplay(display + number);
      setFormula(formula + number);
    }
  };

  const handleOperator = (operator) => {
    setLastNumber(parseFloat(display));
    setLastOperation(operator);
    setDisplay('0');
    setFormula(formula + ' ' + operator + ' ');
  };

  const handleEqual = () => {
    if (lastOperation && lastNumber !== null) {
      const current = parseFloat(display);
      let result;

      switch (lastOperation) {
        case '+':
          result = lastNumber + current;
          break;
        case '-':
          result = lastNumber - current;
          break;
        case '×':
          result = lastNumber * current;
          break;
        case '÷':
          result = lastNumber / current;
          break;
        case '%':
          result = lastNumber % current;
          break;
        default:
          return;
      }

      setDisplay(result.toString());
      setFormula(formula + ' = ' + result);
      setLastOperation(null);
      setLastNumber(null);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setFormula('');
    setLastOperation(null);
    setLastNumber(null);
  };

  const handleMemory = (operation) => {
    const current = parseFloat(display);
    switch (operation) {
      case 'M+':
        setMemory(memory + current);
        setFormula(`M+ ${current}`);
        break;
      case 'M-':
        setMemory(memory - current);
        setFormula(`M- ${current}`);
        break;
      case 'MR':
        setDisplay(memory.toString());
        setFormula(`MR = ${memory}`);
        break;
      case 'MC':
        setMemory(0);
        setFormula('MC');
        break;
      default:
        break;
    }
  };

  const handleScientific = (operation) => {
    const current = parseFloat(display);
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
      case 'square':
        result = current * current;
        operationSymbol = 'x²';
        break;
      case 'cube':
        result = current * current * current;
        operationSymbol = 'x³';
        break;
      case 'factorial':
        result = factorial(current);
        operationSymbol = '!';
        break;
      default:
        return;
    }

    setDisplay(result.toString());
    setFormula(`${operationSymbol}(${current}) = ${result}`);
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

  return (
    <div className="calculator">
      <Display value={display} formula={formula} />
      <Keypad
        onNumber={handleNumber}
        onOperator={handleOperator}
        onEqual={handleEqual}
        onClear={handleClear}
        onMemory={handleMemory}
        onScientific={handleScientific}
        isRadMode={isRadMode}
        onToggleMode={() => setIsRadMode(!isRadMode)}
      />
    </div>
  );
};

export default Calculator; 