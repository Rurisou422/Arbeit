import React, { useState } from 'react';
import styled from 'styled-components';

const CalculatorContainer = styled.div`
  height: 100%;
  background-color: #202020;
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  overflow: hidden;
`;

const Display = styled.div`
  background-color: #1e1e1e;
  color: white;
  padding: 20px;
  text-align: right;
  font-size: 32px;
  font-family: 'Consolas', monospace;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  word-break: break-all;
`;

const PreviousOperation = styled.div`
  font-size: 16px;
  color: #aaa;
  margin-bottom: 5px;
  min-height: 20px;
`;

const CurrentValue = styled.div`
  font-size: 32px;
`;

const ButtonsContainer = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 1px;
  background-color: #333;
  padding: 1px;
`;

const Button = styled.button`
  border: none;
  font-size: 24px;
  padding: 15px;
  background-color: ${props => props.operator ? '#0078d7' : 
                              props.clear ? '#e74c3c' : 
                              props.equals ? '#27ae60' : '#444'};
  color: white;
  cursor: pointer;
  transition: background-color 0.1s;
  
  &:hover {
    background-color: ${props => props.operator ? '#006cbe' : 
                               props.clear ? '#c0392b' : 
                               props.equals ? '#219955' : '#555'};
  }
  
  &:active {
    background-color: ${props => props.operator ? '#005ba1' : 
                               props.clear ? '#a63529' : 
                               props.equals ? '#1e8449' : '#666'};
  }
`;

function Calculator() {
  const [currentValue, setCurrentValue] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [previousCalculation, setPreviousCalculation] = useState('');
  
  const clearAll = () => {
    setCurrentValue('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
    setPreviousCalculation('');
  };
  
  const clearEntry = () => {
    setCurrentValue('0');
  };
  
  const appendDigit = (digit) => {
    if (waitingForOperand) {
      setCurrentValue(digit);
      setWaitingForOperand(false);
    } else {
      setCurrentValue(currentValue === '0' ? digit : currentValue + digit);
    }
  };
  
  const appendDecimal = () => {
    if (waitingForOperand) {
      setCurrentValue('0.');
      setWaitingForOperand(false);
    } else if (currentValue.indexOf('.') === -1) {
      setCurrentValue(currentValue + '.');
    }
  };
  
  const toggleSign = () => {
    setCurrentValue(parseFloat(currentValue) * -1 + '');
  };
  
  const inputPercent = () => {
    const value = parseFloat(currentValue);
    setCurrentValue((value / 100) + '');
  };
  
  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(currentValue);
    
    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValueNum = parseFloat(currentValue);
      const previousValueNum = previousValue;
      
      let newValue;
      
      switch (operation) {
        case '+':
          newValue = previousValueNum + currentValueNum;
          break;
        case '-':
          newValue = previousValueNum - currentValueNum;
          break;
        case '×':
          newValue = previousValueNum * currentValueNum;
          break;
        case '÷':
          newValue = previousValueNum / currentValueNum;
          break;
        default:
          newValue = currentValueNum;
      }
      
      setPreviousCalculation(`${previousValueNum} ${operation} ${currentValueNum} = ${newValue}`);
      setPreviousValue(newValue);
      setCurrentValue(newValue + '');
    }
    
    setWaitingForOperand(true);
    setOperation(nextOperation);
  };
  
  return (
    <CalculatorContainer>
      <Display>
        <PreviousOperation>{previousCalculation}</PreviousOperation>
        <CurrentValue>{currentValue}</CurrentValue>
      </Display>
      <ButtonsContainer>
        <Button clear onClick={clearAll}>AC</Button>
        <Button clear onClick={clearEntry}>CE</Button>
        <Button operator onClick={inputPercent}>%</Button>
        <Button operator onClick={() => performOperation('÷')}>÷</Button>
        
        <Button onClick={() => appendDigit('7')}>7</Button>
        <Button onClick={() => appendDigit('8')}>8</Button>
        <Button onClick={() => appendDigit('9')}>9</Button>
        <Button operator onClick={() => performOperation('×')}>×</Button>
        
        <Button onClick={() => appendDigit('4')}>4</Button>
        <Button onClick={() => appendDigit('5')}>5</Button>
        <Button onClick={() => appendDigit('6')}>6</Button>
        <Button operator onClick={() => performOperation('-')}>-</Button>
        
        <Button onClick={() => appendDigit('1')}>1</Button>
        <Button onClick={() => appendDigit('2')}>2</Button>
        <Button onClick={() => appendDigit('3')}>3</Button>
        <Button operator onClick={() => performOperation('+')}>+</Button>
        
        <Button onClick={toggleSign}>±</Button>
        <Button onClick={() => appendDigit('0')}>0</Button>
        <Button onClick={appendDecimal}>.</Button>
        <Button equals onClick={() => performOperation('=')}>=</Button>
      </ButtonsContainer>
    </CalculatorContainer>
  );
}

export default Calculator; 