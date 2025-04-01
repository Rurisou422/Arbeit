import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import StartMenu from './StartMenu';

const TaskbarContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 40px;
  background-color: #202020;
  display: flex;
  align-items: center;
  padding: 0 10px;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;
`;

const StartButton = styled.button`
  background-color: ${props => props.isOpen ? '#1a1a1a' : '#0078d7'};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 15px;
  font-weight: bold;
  margin-right: 10px;
  cursor: pointer;
  height: 30px;
  
  &:hover {
    background-color: ${props => props.isOpen ? '#2a2a2a' : '#1683d8'};
  }
  
  &:active {
    background-color: ${props => props.isOpen ? '#1a1a1a' : '#006cbe'};
  }
`;

const TaskbarItems = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  align-items: center;
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const TaskbarItem = styled.div`
  height: 34px;
  min-width: 40px;
  padding: 0 10px;
  margin-right: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  border-bottom: 2px solid ${props => props.active ? '#0078d7' : 'transparent'};
  cursor: pointer;
  white-space: nowrap;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  .taskbar-item-icon {
    margin-right: 5px;
  }
  
  .taskbar-item-title {
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    color: white;
    font-size: 13px;
  }
`;

const SystemTray = styled.div`
  display: flex;
  align-items: center;
  color: white;
  font-size: 12px;
`;

const Clock = styled.div`
  padding: 0 10px;
  font-size: 13px;
  color: white;
`;

function Taskbar({ openApps = [], onAppClick, activeAppId, onOpenApp }) {
  const [time, setTime] = useState(new Date());
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    // Add click event to close start menu when clicking elsewhere
    const handleClickOutside = (event) => {
      if (startMenuOpen && !event.target.closest('.start-menu') && 
          !event.target.closest('.start-button')) {
        setStartMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      clearInterval(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [startMenuOpen]);
  
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const toggleStartMenu = () => {
    setStartMenuOpen(!startMenuOpen);
  };
  
  const handleStartMenuItemClick = (appId) => {
    if (onOpenApp) {
      console.log('Opening app from start menu:', appId);
      onOpenApp(appId);
      setStartMenuOpen(false);
    }
  };
  
  return (
    <>
      <StartMenu 
        isOpen={startMenuOpen} 
        className="start-menu" 
        onAppClick={handleStartMenuItemClick}
      />
      <TaskbarContainer>
        <StartButton 
          onClick={toggleStartMenu} 
          isOpen={startMenuOpen}
          className="start-button"
        >
          Start
        </StartButton>
        
        <TaskbarItems>
          {openApps.map(app => (
            <TaskbarItem 
              key={app.id} 
              active={app.id === activeAppId}
              onClick={() => onAppClick(app.id)}
            >
              <span className="taskbar-item-icon">{app.icon}</span>
              <span className="taskbar-item-title">{app.title}</span>
            </TaskbarItem>
          ))}
        </TaskbarItems>
        
        <SystemTray>
          <div style={{ marginRight: '10px' }}>🔊</div>
          <div style={{ marginRight: '10px' }}>🔋</div>
          <div style={{ marginRight: '10px' }}>📶</div>
        </SystemTray>
        
        <Clock>{formatTime(time)}</Clock>
      </TaskbarContainer>
    </>
  );
}

export default Taskbar; 