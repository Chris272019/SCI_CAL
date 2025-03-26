import React from 'react';
import './Keypad.css';

const Keypad = ({
  onNumber,
  onOperator,
  onEqual,
  onClear,
  onMemory,
  onScientific,
  isRadMode,
  onToggleMode
}) => {
  return (
    <div className="keypad">
      <div className="keypad-row">
        <button onClick={() => onMemory('MC')}>MC</button>
        <button onClick={() => onMemory('MR')}>MR</button>
        <button onClick={() => onMemory('M+')}>M+</button>
        <button onClick={() => onMemory('M-')}>M-</button>
        <button onClick={onClear}>C</button>
      </div>

      <div className="keypad-row">
        <button onClick={() => onScientific('sin')}>sin</button>
        <button onClick={() => onScientific('cos')}>cos</button>
        <button onClick={() => onScientific('tan')}>tan</button>
        <button onClick={() => onScientific('log')}>log</button>
        <button onClick={() => onScientific('ln')}>ln</button>
      </div>

      <div className="keypad-row">
        <button onClick={() => onScientific('sqrt')}>√</button>
        <button onClick={() => onScientific('square')}>x²</button>
        <button onClick={() => onScientific('cube')}>x³</button>
        <button onClick={() => onScientific('factorial')}>n!</button>
        <button onClick={() => onOperator('÷')}>÷</button>
      </div>

      <div className="keypad-row">
        <button onClick={() => onNumber('7')}>7</button>
        <button onClick={() => onNumber('8')}>8</button>
        <button onClick={() => onNumber('9')}>9</button>
        <button onClick={() => onOperator('×')}>×</button>
        <button onClick={() => onOperator('%')}>%</button>
      </div>

      <div className="keypad-row">
        <button onClick={() => onNumber('4')}>4</button>
        <button onClick={() => onNumber('5')}>5</button>
        <button onClick={() => onNumber('6')}>6</button>
        <button onClick={() => onOperator('-')}>-</button>
        <button onClick={onToggleMode}>{isRadMode ? 'DEG' : 'RAD'}</button>
      </div>

      <div className="keypad-row">
        <button onClick={() => onNumber('1')}>1</button>
        <button onClick={() => onNumber('2')}>2</button>
        <button onClick={() => onNumber('3')}>3</button>
        <button onClick={() => onOperator('+')}>+</button>
        <button onClick={onEqual}>=</button>
      </div>

      <div className="keypad-row">
        <button onClick={() => onNumber('0')}>0</button>
        <button onClick={() => onNumber('.')}>.</button>
      </div>
    </div>
  );
};

export default Keypad; 