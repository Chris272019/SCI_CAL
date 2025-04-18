import React from 'react';
import './Calculator.css';

const Display = ({ value, formula }) => {
  return (
   
    <div className="display">
      <div className="display-formula">{formula}</div>
      <div className="display-value">{value}</div>
    </div>
  );
};

export default Display; 