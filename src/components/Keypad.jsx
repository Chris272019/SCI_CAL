import React from 'react';
import './Calculator.css';
import { FaHistory, FaTrash, FaTimes } from "react-icons/fa";

const Keypad = ({
  onNumber,
  onOperator,
  onEqual,
  onClear,
  onMemory,
  onScientific,
  isRadMode,
  onToggleMode,
  onHistory,
  onClearHistory,
  onFunction,
  onAllClear,
  onAns,
  onDirection,
  onParenthesis,
  onPercentage,
  formula,
  display,
  showHistory,
  history,
  historyButtonText
}) => {
  return (
    <div className="calculator">
      <div className="display-container">
        <div className="display">
          <div className="formula">{formula}</div>
          <div className="result">{display}</div>
        </div>
      </div>
      <div className="button-container">
  {/* Show/Hide History Button */}
  <button className="history-btn" onClick={onHistory}>
    {showHistory ? (
      <>
        <span className="icon-right">
          <FaTimes/>
        </span>
      </>
    ) : (
      <>
        
        <span className="icon-right">
          <FaHistory/>
        </span>
      </>
    )}
  </button>
</div>

{/* History Sidebar */}
<div className={`history-sidebar ${showHistory ? "show" : ""}`}>
  <div className="history-header">
    <h3>Calculation History</h3>
    <button className="close-history" onClick={onHistory}>
      <FaTimes />
     
    </button>
  </div>

  {/* History List */}
  <div className="history-list">
    {history.length > 0 ? (
      history.map((item, index) => (
        <div key={index} className="history-item">
          <div className="history-formula">{item}</div>
          <button className="clear-history" onClick={onClearHistory}>
      <FaTrash className="icon-right" />
      </button>
        </div>
      ))
    ) : (
      <div className="empty-history">No history available</div>
    )}
  </div>
</div>

      <div className={`keypad ${showHistory ? 'hidden' : ''}`}>
        <div className="keypad-row">
          <button className="function" onClick={() => onFunction('x2')}>x²</button>
          <button className="function" onClick={() => onFunction('x3')}>x³</button>
          <button className="function" onClick={() => onFunction('x-1')}>x⁻¹</button>
          <button className="function" onClick={() => onFunction('sqrt')}>√</button>
          <button className="function" onClick={() => onFunction('cube-root')}>∛</button>
        </div>
        <div className="keypad-row">
          <button className="function" onClick={() => onFunction('eng')}>ENG</button>
          <button className="function" onClick={() => onFunction('log')}>log</button>
          <button className="function" onClick={() => onFunction('ln')}>ln</button>
          <button className="function" onClick={() => onFunction('10x')}>10ˣ</button>
          <button className="function" onClick={() => onFunction('ex')}>eˣ</button>
        </div>
        <div className="keypad-row">
          <button className="function" onClick={() => onFunction('sin')}>sin</button>
          <button className="function" onClick={() => onFunction('cos')}>cos</button>
          <button className="function" onClick={() => onFunction('tan')}>tan</button>
          <button className="function" onClick={() => onFunction('pi')}>π</button>
          <button className="function" onClick={() => onFunction('e')}>e</button>
        </div>
        <div className="keypad-row">
          <button className="function" onClick={() => onFunction('factorial')}>x!</button>
          <button className="function" onClick={() => onFunction('abs')}>|x|</button>
          <button className="function" onClick={() => onFunction('eng')}>ENG</button>
        </div>
        <div className="keypad-row">
          <button className="number" onClick={() => onNumber('7')}>7</button>
          <button className="number" onClick={() => onNumber('8')}>8</button>
          <button className="number" onClick={() => onNumber('9')}>9</button>
          <button className="operator" onClick={() => onOperator('÷')}>÷</button>
          <button className="memory" onClick={() => onMemory('mc')}>MC</button>
        </div>
        <div className="keypad-row">
          <button className="number" onClick={() => onNumber('4')}>4</button>
          <button className="number" onClick={() => onNumber('5')}>5</button>
          <button className="number" onClick={() => onNumber('6')}>6</button>
          <button className="operator" onClick={() => onOperator('×')}>×</button>
          <button className="memory" onClick={() => onMemory('mr')}>MR</button>
        </div>
        <div className="keypad-row">
          <button className="number" onClick={() => onNumber('1')}>1</button>
          <button className="number" onClick={() => onNumber('2')}>2</button>
          <button className="number" onClick={() => onNumber('3')}>3</button>
          <button className="operator" onClick={() => onOperator('-')}>-</button>
          <button className="memory" onClick={() => onMemory('m+')}>M+</button>
        </div>
        <div className="keypad-row">
          <button className="number" onClick={() => onNumber('0')}>0</button>
          <button className="number" onClick={() => onNumber('.')}>.</button>
          <button className="operator" onClick={onEqual}>=</button>
          <button className="operator" onClick={() => onOperator('+')}>+</button>
          <button className="memory" onClick={() => onMemory('m-')}>M-</button>
        </div>
        <div className="keypad-row">
          <button className="function" onClick={() => onDirection('left')}>←</button>
          <button className="function" onClick={() => onDirection('right')}>→</button>
          <button className="function" onClick={onClear}>C</button>
          <button className="function" onClick={onAllClear}>AC</button>
          <button className="function" onClick={onAns}>Ans</button>
        </div>
        <div className="keypad-row">
          <button className="function" onClick={() => onParenthesis('(')}>(</button>
          <button className="function" onClick={() => onParenthesis(')')}>)</button>
          <button className="function" onClick={() => onPercentage('%')}>%</button>
          <button className="function" onClick={onToggleMode}>{isRadMode ? 'DEG' : 'RAD'}</button>
        </div>
      </div>
    </div>
  );
};

export default Keypad; 