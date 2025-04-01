import React, { useState } from 'react';
import styled from 'styled-components';

const MenuContainer = styled.div`
  position: absolute;
  bottom: 40px;
  left: 0;
  width: 300px;
  height: 500px;
  background-color: #202020;
  border: 1px solid #303030;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  z-index: 1001;
  color: white;
  flex-direction: column;
`;

const MenuHeader = styled.div`
  height: 80px;
  background-color: #0078d7;
  display: flex;
  align-items: center;
  padding: 0 20px;
  font-size: 24px;
  font-weight: bold;
`;

const MenuItems = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px 0;
`;

const MenuItem = styled.div`
  padding: 10px 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const IconWrapper = styled.div`
  font-size: 24px;
  margin-right: 15px;
  width: 30px;
  text-align: center;
`;

const MenuFooter = styled.div`
  height: 60px;
  border-top: 1px solid #303030;
  display: flex;
  align-items: center;
  padding: 0 20px;
`;

const PowerButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

// Search input in start menu
const SearchContainer = styled.div`
  padding: 10px 20px;
  border-bottom: 1px solid #303030;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 4px;
  
  &:focus {
    outline: none;
    background-color: #444;
  }
`;

function StartMenu({ isOpen, onAppClick, className }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const menuItems = [
    { id: 2, name: 'File Explorer', icon: '📁', appId: 'fileExplorer' },
    { id: 4, name: 'Notepad', icon: '📄', appId: 'notepad' },
    { id: 7, name: 'Calendar', icon: '📅', appId: 'calendar' },
    { id: 8, name: 'Private AI Assistant', icon: '🤖', appId: 'aiChat' },
  ];
  
  const filteredItems = searchTerm 
    ? menuItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : menuItems;
  
  const handleAppClick = (appId) => {
    if (onAppClick) {
      console.log('Opening app:', appId);
      onAppClick(appId);
    }
  };
  
  const handlePowerClick = () => {
    // In a real system, this would show power options
    if (window.confirm('Do you really want to shut down?')) {
      alert('System shutting down... (just kidding, this is a web app)');
    }
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <MenuContainer isOpen={isOpen} className={className}>
      <MenuHeader>
        User
      </MenuHeader>
      
      <SearchContainer>
        <SearchInput 
          placeholder="Search apps..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </SearchContainer>
      
      <MenuItems>
        {filteredItems.map(item => (
          <MenuItem 
            key={item.id}
            onClick={() => handleAppClick(item.appId)}
          >
            <IconWrapper>{item.icon}</IconWrapper>
            {item.name}
          </MenuItem>
        ))}
      </MenuItems>
      
      <MenuFooter>
        <PowerButton onClick={handlePowerClick}>
          <IconWrapper>⏻</IconWrapper>
          Power
        </PowerButton>
      </MenuFooter>
    </MenuContainer>
  );
}

export default StartMenu; 