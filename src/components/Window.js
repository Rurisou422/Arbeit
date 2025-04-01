import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const WindowContainer = styled.div`
  position: absolute;
  background-color: #202020;
  border-radius: 4px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 300px;
  min-height: 200px;
  z-index: ${props => props.isActive ? 999 : 998};
  resize: both;
`;

const WindowHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 0 10px;
  background-color: #333;
  height: 32px;
  cursor: move;
  user-select: none;
`;

const WindowTitle = styled.div`
  flex: 1;
  color: white;
  font-size: 14px;
  font-weight: 500;
  margin-left: 5px;
`;

const WindowControls = styled.div`
  display: flex;
  align-items: center;
`;

const WindowButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.close ? '#e81123' : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const WindowContent = styled.div`
  flex: 1;
  padding: 10px;
  overflow: auto;
  background-color: #202020;
  color: white;
`;

function Window({ 
  id, 
  title, 
  icon, 
  initialPosition = { x: 100, y: 100 }, 
  initialSize = { width: 600, height: 400 },
  onClose, 
  onFocus,
  isActive,
  children 
}) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [previousState, setPreviousState] = useState(null);
  
  const windowRef = useRef(null);
  
  // Handle dragging
  useEffect(() => {
    if (!isDragging) return;
    
    function handleMouseMove(e) {
      if (isMaximized) return;
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
    
    function handleMouseUp() {
      setIsDragging(false);
    }
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, isMaximized]);
  
  const handleMouseDown = (e) => {
    if (!windowRef.current) return;
    
    onFocus(id);
    
    if (isMaximized) return;
    
    const rect = windowRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    setIsDragging(true);
  };
  
  const handleWindowClick = () => {
    onFocus(id);
  };
  
  const toggleMaximize = () => {
    if (isMaximized) {
      // Restore to previous state
      if (previousState) {
        setPosition(previousState.position);
        setIsMaximized(false);
      }
    } else {
      // Save current state and maximize
      setPreviousState({
        position: { ...position }
      });
      setPosition({ x: 0, y: 0 });
      setIsMaximized(true);
    }
  };
  
  const styles = {
    ...(isMaximized ? {
      top: 0,
      left: 0,
      right: 0,
      bottom: 40, // Leave space for taskbar
      width: '100%',
      height: 'calc(100vh - 40px)',
      borderRadius: 0
    } : {
      top: `${position.y}px`,
      left: `${position.x}px`,
      width: initialSize.width + 'px',
      height: initialSize.height + 'px'
    })
  };
  
  return (
    <WindowContainer 
      ref={windowRef}
      style={styles}
      isActive={isActive}
      onClick={handleWindowClick}
    >
      <WindowHeader onMouseDown={handleMouseDown}>
        <span>{icon}</span>
        <WindowTitle>{title}</WindowTitle>
        <WindowControls>
          <WindowButton onClick={toggleMaximize}>
            {isMaximized ? '🗗' : '🗖'}
          </WindowButton>
          <WindowButton close onClick={onClose}>✕</WindowButton>
        </WindowControls>
      </WindowHeader>
      <WindowContent>
        {children}
      </WindowContent>
    </WindowContainer>
  );
}

export default Window; 