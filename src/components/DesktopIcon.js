import React from 'react';
import styled from 'styled-components';

const IconContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 90px;
  cursor: ${props => props.isDragging ? 'grabbing' : 'pointer'};
  border-radius: 5px;
  padding: 5px;
  background-color: ${props => props.selected ? 'rgba(0, 120, 215, 0.3)' : 'transparent'};
  left: ${props => props.position.x}px;
  top: ${props => props.position.y}px;
  z-index: ${props => props.isDragging ? 10 : 1};
  
  &:hover {
    background-color: ${props => props.selected ? 'rgba(0, 120, 215, 0.4)' : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const IconSymbol = styled.div`
  font-size: 32px;
  margin-bottom: 5px;
`;

const IconName = styled.div`
  font-size: 12px;
  color: white;
  text-align: center;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.8);
  word-break: break-word;
  max-width: 100%;
  max-height: 40px;
  overflow: hidden;
`;

function DesktopIcon({ 
  name, 
  icon, 
  position, 
  selected, 
  onClick, 
  onDoubleClick, 
  onMouseDown,
  isDragging 
}) {
  return (
    <IconContainer 
      position={position}
      selected={selected}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onMouseDown={onMouseDown}
      isDragging={isDragging}
    >
      <IconSymbol>{icon}</IconSymbol>
      <IconName>{name}</IconName>
    </IconContainer>
  );
}

export default DesktopIcon; 