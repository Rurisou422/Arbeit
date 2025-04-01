import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import DesktopIcon from './DesktopIcon';

const DesktopContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 40px; /* Space for taskbar */
  background-image: url('/wallpaper.jpg'), linear-gradient(to bottom right, #0078d7, #004e8c);
  background-size: cover;
  background-position: center;
  overflow: hidden;
  user-select: none;
  padding: 10px;
`;

const ContextMenu = styled.div`
  position: absolute;
  width: 200px;
  background-color: #202020;
  border: 1px solid #303030;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: ${props => props.visible ? 'block' : 'none'};
  left: ${props => props.x}px;
  top: ${props => props.y}px;
`;

const MenuItem = styled.div`
  padding: 8px 12px;
  color: white;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

function Desktop({ onOpenApp }) {
  // Desktop icons with their corresponding app IDs
  const [icons, setIcons] = useState([
    { id: 1, name: 'My Computer', icon: '💻', x: 20, y: 20, appId: 'fileExplorer' },
    { id: 2, name: 'Documents', icon: '📁', x: 20, y: 120, appId: 'fileExplorer' },
    { id: 3, name: 'Recycle Bin', icon: '🗑️', x: 20, y: 220, appId: 'fileExplorer' },
    { id: 5, name: 'Notepad', icon: '📄', x: 120, y: 20, appId: 'notepad' },
    { id: 9, name: 'Calendar', icon: '📅', x: 120, y: 120, appId: 'calendar' },
    { id: 10, name: 'Private AI', icon: '🤖', x: 120, y: 220, appId: 'aiChat' },
    { id: 11, name: 'IT-Tickets', icon: '🎫', x: 220, y: 20, appId: 'ticketSystem' },
  ]);
  
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0
  });
  
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [draggingIcon, setDraggingIcon] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const desktopRef = useRef(null);
  
  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY
    });
  };
  
  const handleClick = () => {
    if (contextMenu.visible) {
      setContextMenu({ ...contextMenu, visible: false });
    }
    // Deselect icon when clicking on desktop
    setSelectedIcon(null);
  };

  const handleIconClick = (e, iconId) => {
    e.stopPropagation(); // Prevent desktop click handler from firing
    setSelectedIcon(iconId === selectedIcon ? null : iconId);
  };
  
  const handleIconDoubleClick = (icon) => {
    // Open the corresponding application
    if (icon.appId && onOpenApp) {
      console.log('Desktop opening app:', icon.appId, icon.name);
      onOpenApp(icon.appId);
    }
  };
  
  const handleIconMouseDown = (e, icon) => {
    e.stopPropagation();
    
    // Only allow dragging with left mouse button
    if (e.button !== 0) return;
    
    // Select the icon
    setSelectedIcon(icon.id);
    
    // Start dragging
    setDraggingIcon(icon.id);
    
    // Calculate offset from the icon's top-left corner
    const iconRect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - iconRect.left,
      y: e.clientY - iconRect.top
    });
    
    // Add event listeners for move and up
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  const handleMouseMove = (e) => {
    if (!draggingIcon) return;
    
    // Get desktop bounds
    const desktopRect = desktopRef.current.getBoundingClientRect();
    
    // Calculate new position relative to desktop
    let newX = e.clientX - desktopRect.left - dragOffset.x;
    let newY = e.clientY - desktopRect.top - dragOffset.y;
    
    // Ensure icon stays within desktop bounds
    newX = Math.max(0, Math.min(newX, desktopRect.width - 80));
    newY = Math.max(0, Math.min(newY, desktopRect.height - 90));
    
    // Update icon position
    setIcons(icons.map(icon => 
      icon.id === draggingIcon
        ? { ...icon, x: newX, y: newY }
        : icon
    ));
  };
  
  const handleMouseUp = () => {
    setDraggingIcon(null);
    
    // Remove event listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
  
  const handleRefresh = () => {
    setContextMenu({ ...contextMenu, visible: false });
    // In a real application, this would refresh the desktop
    alert('Desktop refreshed');
  };
  
  const handleViewChange = () => {
    setContextMenu({ ...contextMenu, visible: false });
    // In a real application, this would change the view
    alert('View options would appear here');
  };
  
  const handleNewFolder = () => {
    setContextMenu({ ...contextMenu, visible: false });
    // Create a new folder icon
    const newId = Math.max(...icons.map(icon => icon.id)) + 1;
    const newFolder = {
      id: newId,
      name: 'New Folder',
      icon: '📁',
      x: 20,
      y: Math.max(...icons.map(icon => icon.y)) + 100,
      appId: 'fileExplorer'
    };
    setIcons([...icons, newFolder]);
    setSelectedIcon(newId);
  };

  return (
    <DesktopContainer 
      ref={desktopRef}
      onContextMenu={handleContextMenu}
      onClick={handleClick}
    >
      {icons.map(icon => (
        <DesktopIcon 
          key={icon.id}
          name={icon.name}
          icon={icon.icon}
          position={{ x: icon.x, y: icon.y }}
          selected={selectedIcon === icon.id}
          onClick={(e) => handleIconClick(e, icon.id)}
          onDoubleClick={() => handleIconDoubleClick(icon)}
          onMouseDown={(e) => handleIconMouseDown(e, icon)}
          isDragging={draggingIcon === icon.id}
        />
      ))}
      
      <ContextMenu 
        visible={contextMenu.visible} 
        x={contextMenu.x} 
        y={contextMenu.y}
      >
        <MenuItem onClick={handleViewChange}>View</MenuItem>
        <MenuItem onClick={handleRefresh}>Refresh</MenuItem>
        <MenuItem onClick={handleNewFolder}>New Folder</MenuItem>
      </ContextMenu>
    </DesktopContainer>
  );
}

export default Desktop; 