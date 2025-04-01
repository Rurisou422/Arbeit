import React, { useState } from 'react';
import './styles/App.css';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import Window from './components/Window';

// Import applications
import FileExplorer from './components/apps/FileExplorer';
import Notepad from './components/apps/Notepad';
import AIChat from './components/apps/AIChat';
import TicketSystem from './components/apps/TicketSystem';

function App() {
  const [windows, setWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);
  const [nextWindowId, setNextWindowId] = useState(1);
  
  // Application definitions
  const apps = {
    fileExplorer: { title: 'File Explorer', icon: '📁', component: FileExplorer },
    notepad: { title: 'Notepad', icon: '📄', component: Notepad },
    calendar: { title: 'Calendar', icon: '📅', component: () => <div>Calendar app placeholder</div> },
    aiChat: { title: 'Private AI Assistant', icon: '🤖', component: AIChat },
    ticketSystem: { title: 'IT-Support Ticketsystem', icon: '🎫', component: TicketSystem },
  };
  
  // Function to open a new application window
  const openApp = (appId) => {
    console.log('App.js attempting to open app:', appId);
    if (apps[appId]) {
      const app = apps[appId];
      const windowId = nextWindowId;
      
      // Check if app is already open
      const existingWindow = windows.find(w => w.appId === appId);
      
      if (existingWindow) {
        // Focus the existing window
        console.log('App already open, focusing:', existingWindow.id);
        setActiveWindowId(existingWindow.id);
      } else {
        // Create a new window
        console.log('Creating new window for app:', appId);
        const newWindow = {
          id: windowId,
          appId,
          title: app.title,
          icon: app.icon,
          position: { 
            x: 100 + (windows.length * 30) % 200, 
            y: 100 + (windows.length * 30) % 200 
          },
          size: app.size || { width: 800, height: 600 }
        };
        
        setWindows([...windows, newWindow]);
        setActiveWindowId(windowId);
        setNextWindowId(nextWindowId + 1);
      }
      
      return true;
    } else {
      console.error('App not found:', appId);
      return false;
    }
  };
  
  // Function to close a window
  const closeWindow = (windowId) => {
    setWindows(windows.filter(window => window.id !== windowId));
    
    if (activeWindowId === windowId) {
      const remainingWindows = windows.filter(window => window.id !== windowId);
      setActiveWindowId(remainingWindows.length > 0 ? remainingWindows[remainingWindows.length - 1].id : null);
    }
  };
  
  // Function to focus a window
  const focusWindow = (windowId) => {
    if (windowId !== activeWindowId) {
      setActiveWindowId(windowId);
    }
  };
  
  // Function to check if window is active
  const isWindowActive = (windowId) => {
    return windowId === activeWindowId;
  };
  
  return (
    <div className="app">
      <Desktop onOpenApp={openApp} />
      
      {/* Render all open windows */}
      {windows.map(window => (
        <Window
          key={window.id}
          id={window.id}
          title={window.title}
          icon={window.icon}
          initialPosition={window.position}
          initialSize={window.size}
          onClose={() => closeWindow(window.id)}
          onFocus={focusWindow}
          isActive={isWindowActive(window.id)}
        >
          {React.createElement(apps[window.appId].component, { 
            windowId: window.id,
            closeWindow: () => closeWindow(window.id)
          })}
        </Window>
      ))}
      
      <Taskbar 
        openApps={windows} 
        onAppClick={focusWindow} 
        activeAppId={activeWindowId}
        onOpenApp={openApp}
      />
    </div>
  );
}

export default App; 