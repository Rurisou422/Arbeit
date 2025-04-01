import React, { useState } from 'react';
import styled from 'styled-components';

const NotepadContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const MenuBar = styled.div`
  display: flex;
  background-color: #333;
  padding: 5px;
  border-radius: 4px 4px 0 0;
`;

const MenuItem = styled.div`
  color: white;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
  position: relative;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  &:hover > div {
    display: block;
  }
`;

const SubmenuContainer = styled.div`
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #333;
  border-radius: 4px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  z-index: 100;
  min-width: 150px;
`;

const SubmenuItem = styled.div`
  color: white;
  padding: 8px 15px;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const EditorContainer = styled.div`
  flex: 1;
  background-color: #1e1e1e;
  padding: 10px;
  overflow: hidden;
  display: flex;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 100%;
  background-color: #1e1e1e;
  color: white;
  border: none;
  resize: none;
  font-family: 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
  
  &:focus {
    outline: none;
  }
`;

const StatusBar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
  background-color: #333;
  color: white;
  font-size: 12px;
  border-radius: 0 0 4px 4px;
`;

function Notepad() {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('Untitled.txt');
  const [isSaved, setIsSaved] = useState(true);
  
  const handleTextChange = (e) => {
    setText(e.target.value);
    setIsSaved(false);
  };
  
  const handleNewFile = () => {
    if (!isSaved) {
      if (window.confirm('Do you want to save changes?')) {
        handleSaveFile();
      }
    }
    setText('');
    setFileName('Untitled.txt');
    setIsSaved(true);
  };
  
  const handleOpenFile = () => {
    // In a real app, this would open a file picker
    // For demo purposes, we'll just simulate opening a file
    setText('This is a sample text that was loaded from a file.\n\nYou can edit this content and save it.');
    setFileName('sample.txt');
    setIsSaved(true);
  };
  
  const handleSaveFile = () => {
    // In a real app, this would save to the file system
    // For demo purposes, we'll just simulate saving
    alert(`File "${fileName}" saved!`);
    setIsSaved(true);
  };
  
  const handleSaveAs = () => {
    // In a real app, this would open a save dialog
    // For demo purposes, we'll just prompt for a filename
    const newFileName = prompt('Enter file name:', fileName);
    if (newFileName) {
      setFileName(newFileName);
      handleSaveFile();
    }
  };
  
  const handlePrint = () => {
    alert('Print functionality not implemented in this demo.');
  };
  
  const handleExit = () => {
    if (!isSaved) {
      if (window.confirm('Do you want to save changes before exiting?')) {
        handleSaveFile();
      }
    }
    // In a window system, this would close the window
    alert('Exit command received.');
  };
  
  const handleCut = () => {
    document.execCommand('cut');
  };
  
  const handleCopy = () => {
    document.execCommand('copy');
  };
  
  const handlePaste = () => {
    document.execCommand('paste');
  };
  
  const getLineCount = () => {
    return text.split('\n').length;
  };
  
  const getWordCount = () => {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  };
  
  return (
    <NotepadContainer>
      <MenuBar>
        <MenuItem>
          File
          <SubmenuContainer>
            <SubmenuItem onClick={handleNewFile}>New</SubmenuItem>
            <SubmenuItem onClick={handleOpenFile}>Open...</SubmenuItem>
            <SubmenuItem onClick={handleSaveFile}>Save</SubmenuItem>
            <SubmenuItem onClick={handleSaveAs}>Save As...</SubmenuItem>
            <SubmenuItem onClick={handlePrint}>Print</SubmenuItem>
            <SubmenuItem onClick={handleExit}>Exit</SubmenuItem>
          </SubmenuContainer>
        </MenuItem>
        
        <MenuItem>
          Edit
          <SubmenuContainer>
            <SubmenuItem onClick={handleCut}>Cut</SubmenuItem>
            <SubmenuItem onClick={handleCopy}>Copy</SubmenuItem>
            <SubmenuItem onClick={handlePaste}>Paste</SubmenuItem>
          </SubmenuContainer>
        </MenuItem>
        
        <MenuItem>
          View
          <SubmenuContainer>
            <SubmenuItem>Word Wrap</SubmenuItem>
            <SubmenuItem>Font...</SubmenuItem>
          </SubmenuContainer>
        </MenuItem>
        
        <MenuItem>
          Help
          <SubmenuContainer>
            <SubmenuItem>About Notepad</SubmenuItem>
          </SubmenuContainer>
        </MenuItem>
      </MenuBar>
      
      <EditorContainer>
        <TextArea 
          value={text} 
          onChange={handleTextChange}
          placeholder="Type something here..."
        />
      </EditorContainer>
      
      <StatusBar>
        <div>{isSaved ? 'Saved' : 'Unsaved'}</div>
        <div>Lines: {getLineCount()}, Words: {getWordCount()}</div>
      </StatusBar>
    </NotepadContainer>
  );
}

export default Notepad; 