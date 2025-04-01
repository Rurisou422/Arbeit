import React, { useState } from 'react';
import styled from 'styled-components';

const BrowserContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const AddressBar = styled.div`
  display: flex;
  align-items: center;
  background-color: #333;
  padding: 5px 10px;
  border-radius: 4px;
  margin-bottom: 10px;
`;

const AddressInput = styled.input`
  flex: 1;
  background-color: #444;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    background-color: #555;
  }
`;

const NavigationButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  width: 32px;
  height: 32px;
  margin: 0 5px;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  &:disabled {
    color: #666;
    cursor: not-allowed;
  }
`;

const WebViewFrame = styled.div`
  flex: 1;
  background-color: white;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
`;

const IFrameContainer = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

const HomePage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #f2f2f2;
  color: #333;
`;

const SearchBox = styled.div`
  display: flex;
  width: 80%;
  max-width: 600px;
  margin-bottom: 30px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-right: none;
  border-radius: 24px 0 0 24px;
  
  &:focus {
    outline: none;
    border-color: #0078d7;
  }
`;

const SearchButton = styled.button`
  background-color: #0078d7;
  color: white;
  border: none;
  border-radius: 0 24px 24px 0;
  padding: 0 20px;
  font-size: 16px;
  cursor: pointer;
  
  &:hover {
    background-color: #006cbe;
  }
`;

const Bookmarks = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 800px;
`;

const BookmarkTile = styled.div`
  width: 100px;
  height: 100px;
  margin: 10px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
`;

const BookmarkIcon = styled.div`
  font-size: 32px;
  margin-bottom: 8px;
`;

const BookmarkName = styled.div`
  font-size: 12px;
  text-align: center;
  color: #333;
`;

function Browser() {
  const [url, setUrl] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showHomePage, setShowHomePage] = useState(true);
  
  const bookmarks = [
    { id: 1, name: 'Google', icon: '🔍', url: 'https://google.com' },
    { id: 2, name: 'YouTube', icon: '📺', url: 'https://youtube.com' },
    { id: 3, name: 'GitHub', icon: '🐙', url: 'https://github.com' },
    { id: 4, name: 'Twitter', icon: '🐦', url: 'https://twitter.com' },
    { id: 5, name: 'Reddit', icon: '📱', url: 'https://reddit.com' },
    { id: 6, name: 'Wikipedia', icon: '📚', url: 'https://wikipedia.org' },
  ];
  
  const navigateTo = (newUrl) => {
    if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
      newUrl = 'https://' + newUrl;
    }
    
    setUrl(newUrl);
    setCurrentUrl(newUrl);
    setShowHomePage(false);
    
    // Update history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };
  
  const handleSearch = () => {
    if (url.trim()) {
      navigateTo(url);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentUrl(history[historyIndex - 1]);
      setUrl(history[historyIndex - 1]);
    }
  };
  
  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentUrl(history[historyIndex + 1]);
      setUrl(history[historyIndex + 1]);
    }
  };
  
  const goHome = () => {
    setShowHomePage(true);
    setUrl('');
    setCurrentUrl('');
  };
  
  const handleBookmarkClick = (bookmarkUrl) => {
    navigateTo(bookmarkUrl);
  };
  
  const handleHomeSearch = (e) => {
    e.preventDefault();
    navigateTo(`https://www.google.com/search?q=${encodeURIComponent(url)}`);
  };
  
  return (
    <BrowserContainer>
      <AddressBar>
        <NavigationButton 
          onClick={goBack} 
          disabled={historyIndex <= 0}
        >
          ←
        </NavigationButton>
        <NavigationButton 
          onClick={goForward} 
          disabled={historyIndex >= history.length - 1}
        >
          →
        </NavigationButton>
        <NavigationButton onClick={goHome}>🏠</NavigationButton>
        <AddressInput
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter URL or search terms"
        />
        <NavigationButton onClick={handleSearch}>🔍</NavigationButton>
      </AddressBar>
      
      <WebViewFrame>
        {showHomePage ? (
          <HomePage>
            <h2 style={{ marginBottom: '30px', fontSize: '28px' }}>CustomOS Browser</h2>
            <form onSubmit={handleHomeSearch}>
              <SearchBox>
                <SearchInput
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Search the web"
                  autoFocus
                />
                <SearchButton type="submit">Search</SearchButton>
              </SearchBox>
            </form>
            <Bookmarks>
              {bookmarks.map(bookmark => (
                <BookmarkTile 
                  key={bookmark.id} 
                  onClick={() => handleBookmarkClick(bookmark.url)}
                >
                  <BookmarkIcon>{bookmark.icon}</BookmarkIcon>
                  <BookmarkName>{bookmark.name}</BookmarkName>
                </BookmarkTile>
              ))}
            </Bookmarks>
          </HomePage>
        ) : (
          <IFrameContainer 
            src={currentUrl} 
            title="Web Browser"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        )}
      </WebViewFrame>
    </BrowserContainer>
  );
}

export default Browser; 