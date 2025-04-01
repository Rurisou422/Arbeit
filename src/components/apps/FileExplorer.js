import React, { useState } from 'react';
import styled from 'styled-components';

const ExplorerContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  background-color: #333;
  padding: 5px 10px;
  border-radius: 4px;
  margin-bottom: 10px;
`;

const Button = styled.button`
  background: none;
  border: none;
  color: white;
  margin: 0 5px;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const AddressBar = styled.div`
  flex: 1;
  background-color: #444;
  color: white;
  border-radius: 4px;
  padding: 5px 10px;
  margin: 0 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ExplorerContent = styled.div`
  display: flex;
  flex: 1;
  background-color: #282828;
  border-radius: 4px;
  overflow: hidden;
`;

const Sidebar = styled.div`
  width: 200px;
  background-color: #333;
  padding: 10px;
  overflow-y: auto;
`;

const SidebarItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 10px;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover, &.active {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  span {
    margin-left: 8px;
    color: white;
  }
`;

const FilesContainer = styled.div`
  flex: 1;
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  overflow-y: auto;
`;

const FileItem = styled.div`
  width: 100px;
  height: 100px;
  margin: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  
  &:hover, &.selected {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const FileIcon = styled.div`
  font-size: 32px;
  margin-bottom: 8px;
`;

const FileName = styled.div`
  font-size: 12px;
  text-align: center;
  color: white;
  word-break: break-word;
  max-width: 100%;
`;

const StatusBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px;
  background-color: #333;
  color: white;
  font-size: 12px;
  border-radius: 4px;
  margin-top: 10px;
`;

function FileExplorer() {
  const [currentPath, setCurrentPath] = useState('/Home');
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Sample data structure
  const fileSystem = {
    '/Home': [
      { id: 1, name: 'Documents', type: 'folder', icon: '📁' },
      { id: 2, name: 'Pictures', type: 'folder', icon: '📁' },
      { id: 3, name: 'Music', type: 'folder', icon: '📁' },
      { id: 4, name: 'Downloads', type: 'folder', icon: '📁' },
      { id: 5, name: 'note.txt', type: 'file', icon: '📄' },
      { id: 6, name: 'settings.json', type: 'file', icon: '📄' },
    ],
    '/Home/Documents': [
      { id: 7, name: 'Work', type: 'folder', icon: '📁' },
      { id: 8, name: 'Personal', type: 'folder', icon: '📁' },
      { id: 9, name: 'resume.pdf', type: 'file', icon: '📄' },
      { id: 10, name: 'report.docx', type: 'file', icon: '📄' },
    ],
    '/Home/Pictures': [
      { id: 11, name: 'Vacation', type: 'folder', icon: '📁' },
      { id: 12, name: 'Family', type: 'folder', icon: '📁' },
      { id: 13, name: 'profile.jpg', type: 'file', icon: '🖼️' },
      { id: 14, name: 'wallpaper.png', type: 'file', icon: '🖼️' },
    ],
    '/Home/Music': [
      { id: 15, name: 'Favorites', type: 'folder', icon: '📁' },
      { id: 16, name: 'Playlists', type: 'folder', icon: '📁' },
      { id: 17, name: 'song1.mp3', type: 'file', icon: '🎵' },
      { id: 18, name: 'album.mp3', type: 'file', icon: '🎵' },
    ],
    '/Home/Downloads': [
      { id: 19, name: 'setup.exe', type: 'file', icon: '💿' },
      { id: 20, name: 'data.zip', type: 'file', icon: '📦' },
    ],
  };
  
  const sidebarItems = [
    { id: 1, name: 'Home', icon: '🏠', path: '/Home' },
    { id: 2, name: 'Documents', icon: '📁', path: '/Home/Documents' },
    { id: 3, name: 'Pictures', icon: '🖼️', path: '/Home/Pictures' },
    { id: 4, name: 'Music', icon: '🎵', path: '/Home/Music' },
    { id: 5, name: 'Downloads', icon: '📥', path: '/Home/Downloads' },
  ];
  
  const currentFiles = fileSystem[currentPath] || [];
  
  const navigateTo = (path) => {
    setCurrentPath(path);
    setSelectedFile(null);
  };
  
  const handleFileClick = (file) => {
    setSelectedFile(file.id === selectedFile ? null : file.id);
    
    if (file.type === 'folder') {
      navigateTo(`${currentPath}/${file.name}`);
    }
  };
  
  const handleBackClick = () => {
    const pathParts = currentPath.split('/');
    if (pathParts.length > 2) {
      const newPath = pathParts.slice(0, -1).join('/');
      navigateTo(newPath);
    }
  };
  
  const getSelectedCount = () => {
    return selectedFile ? 1 : 0;
  };
  
  return (
    <ExplorerContainer>
      <Toolbar>
        <Button onClick={handleBackClick} disabled={currentPath === '/Home'}>←</Button>
        <Button>→</Button>
        <Button>↑</Button>
        <Button>🔄</Button>
        <AddressBar>{currentPath}</AddressBar>
        <Button>🔍</Button>
      </Toolbar>
      
      <ExplorerContent>
        <Sidebar>
          {sidebarItems.map(item => (
            <SidebarItem
              key={item.id}
              className={currentPath === item.path ? 'active' : ''}
              onClick={() => navigateTo(item.path)}
            >
              {item.icon} <span>{item.name}</span>
            </SidebarItem>
          ))}
        </Sidebar>
        
        <FilesContainer>
          {currentFiles.map(file => (
            <FileItem
              key={file.id}
              className={selectedFile === file.id ? 'selected' : ''}
              onClick={() => handleFileClick(file)}
              onDoubleClick={() => file.type === 'folder' && handleFileClick(file)}
            >
              <FileIcon>{file.icon}</FileIcon>
              <FileName>{file.name}</FileName>
            </FileItem>
          ))}
        </FilesContainer>
      </ExplorerContent>
      
      <StatusBar>
        <div>{getSelectedCount()} item(s) selected</div>
        <div>{currentFiles.length} item(s)</div>
      </StatusBar>
    </ExplorerContainer>
  );
}

export default FileExplorer; 