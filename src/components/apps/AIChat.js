import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #1a1a1a;
  color: white;
`;

const ChatArea = styled.div`
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const InputArea = styled.div`
  display: flex;
  padding: 10px;
  background-color: #2a2a2a;
  border-top: 1px solid #3a3a3a;
`;

const MessageInput = styled.textarea`
  flex: 1;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px;
  font-size: 14px;
  resize: none;
  height: 60px;
  margin-right: 10px;
  
  &:focus {
    outline: none;
    background-color: #444;
  }
`;

const SendButton = styled.button`
  background-color: #0078d7;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0 20px;
  font-weight: bold;
  cursor: pointer;
  
  &:hover {
    background-color: #1683d8;
  }
  
  &:disabled {
    background-color: #555;
    cursor: not-allowed;
  }
`;

const Message = styled.div`
  padding: 10px 15px;
  border-radius: 10px;
  max-width: 80%;
  word-break: break-word;
  align-self: ${props => props.sender === 'user' ? 'flex-end' : 'flex-start'};
  background-color: ${props => props.sender === 'user' ? '#0078d7' : '#333'};
`;

const Typing = styled.div`
  align-self: flex-start;
  padding: 15px;
  color: #aaa;
`;

const ModelSelector = styled.select`
  background-color: #333;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  margin-right: 10px;
  
  &:focus {
    outline: none;
  }
`;

const Header = styled.div`
  display: flex;
  padding: 10px 15px;
  background-color: #2a2a2a;
  border-bottom: 1px solid #3a3a3a;
  align-items: center;
`;

const Title = styled.div`
  font-weight: bold;
  flex: 1;
`;

const Warning = styled.div`
  background-color: rgba(255, 100, 100, 0.2);
  color: #ff9999;
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
  font-size: 12px;
  align-self: center;
`;

// Settings Modal
const SettingsModal = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 500px;
  background-color: #2a2a2a;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: ${props => props.show ? 'block' : 'none'};
`;

const SettingsTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 20px;
  color: white;
`;

const SettingsField = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: #ddd;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 10px;
  background-color: #333;
  border: 1px solid #444;
  border-radius: 4px;
  color: white;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #0078d7;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  
  background-color: ${props => props.primary ? '#0078d7' : '#444'};
  color: white;
  
  &:hover {
    background-color: ${props => props.primary ? '#1683d8' : '#555'};
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  color: #ddd;
  cursor: pointer;
  font-size: 14px;
`;

const SettingsButton = styled.button`
  background: none;
  border: none;
  color: #ddd;
  font-size: 18px;
  cursor: pointer;
  padding: 5px;
  margin-left: 10px;
  
  &:hover {
    color: white;
  }
`;

// This is a free AI model service that doesn't require keys
// We're using Hugging Face Inference API endpoints
const API_ENDPOINTS = {
  gemma: 'https://api-inference.huggingface.co/models/google/gemma-7b',
  mistral: 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
  llama: 'https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf',
};

// Google Gemini models
const GEMINI_MODELS = [
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', temp: 0.7 },
  { id: 'gemini-1.5-flash-8k', name: 'Gemini 1.5 Flash 8K', temp: 0.7 },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', temp: 0.7 },
  { id: 'gemini-2.0-flash-lite', name: 'Gemini 2.0 Flash Lite', temp: 0.7 },
];

// OpenAI models
const OPENAI_MODELS = [
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', temp: 0.7 },
  { id: 'gpt-4', name: 'GPT-4', temp: 0.7 },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', temp: 0.7 },
];

// Improved mock responses for when API is unavailable
const MOCK_RESPONSES = {
  greeting: [
    "Hello! How can I help you today?",
    "Hi there! What can I assist you with?",
    "Welcome back! How can I be of service?",
    "Greetings! How may I help you?"
  ],
  thanks: [
    "You're welcome! Is there anything else you need help with?",
    "Happy to help! Let me know if you need anything else.",
    "Anytime! What else can I do for you?",
    "No problem at all. Anything else you'd like to know?"
  ],
  farewell: [
    "Goodbye! Feel free to come back if you have more questions.",
    "See you later! Close this window when you're done for privacy.",
    "Until next time! Remember to minimize this window when not in use.",
    "Take care! I'll be here when you need assistance."
  ],
  default: [
    "I understand you're looking for information. While I'm currently operating with limited capabilities due to API restrictions, I can try to help with basic questions.",
    "That's an interesting query. I wish I could provide a more detailed response, but I'm currently running in offline mode with limited capabilities.",
    "I'd like to help with that. However, I'm currently operating in fallback mode with limited access to information.",
    "I appreciate your question. Since we're running on a fallback system, I can only provide basic assistance right now."
  ]
};

// Mock AI response generator
const generateMockResponse = (input) => {
  const text = input.toLowerCase();
  
  // Select category based on input
  let category = 'default';
  if (text.match(/\b(hi|hello|hey|greetings|howdy)\b/)) {
    category = 'greeting';
  } else if (text.match(/\b(thanks|thank you|appreciate|grateful)\b/)) {
    category = 'thanks';
  } else if (text.match(/\b(bye|goodbye|see you|farewell)\b/)) {
    category = 'farewell';
  }
  
  // Get random response from appropriate category
  const responses = MOCK_RESPONSES[category];
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
};

// More sophisticated mock response generator for specific queries
const getSmartMockResponse = (input) => {
  const text = input.toLowerCase();
  
  // Work-related excuse generator
  if (text.includes('excuse') || text.includes('reason') || 
      (text.includes('leave') && text.includes('early'))) {
    const excuses = [
      "You might consider mentioning that you have an important appointment that couldn't be scheduled outside work hours.",
      "A legitimate reason could be that you need to attend to an urgent family matter.",
      "You could explain that you need to receive an important delivery that requires a signature.",
      "Perhaps mention that you're experiencing a migraine that's making it difficult to focus on work."
    ];
    return excuses[Math.floor(Math.random() * excuses.length)];
  }
  
  // Email composition helper
  if (text.includes('email') || text.includes('write') || text.includes('compose')) {
    if (text.includes('boss') || text.includes('manager') || text.includes('supervisor')) {
      return "For a professional email to your manager, start with a clear subject line. Keep the body concise and to the point. Begin with a proper greeting, clearly state your purpose in the first paragraph, provide necessary details in the middle, and end with a professional closing. Remember to proofread before sending.";
    }
    if (text.includes('colleague') || text.includes('coworker')) {
      return "When writing to colleagues, maintain a professional but friendly tone. Start with a clear subject line that indicates the purpose. Open with an appropriate greeting, be direct about your request or information, and close with a friendly sign-off. Keep it concise and relevant.";
    }
    return "For effective email writing: 1) Use a clear subject line, 2) Start with an appropriate greeting, 3) Keep your message concise and focused, 4) Close professionally, and 5) Always proofread before sending.";
  }
  
  // Meeting preparation
  if (text.includes('meeting') && (text.includes('prepare') || text.includes('ready'))) {
    return "To prepare for a meeting: 1) Review the agenda in advance, 2) Prepare any materials you're responsible for, 3) Note down key points or questions you want to raise, 4) Arrive a few minutes early, and 5) Bring a notepad or device for taking notes.";
  }
  
  // Fallback to simple generated response
  return generateMockResponse(input);
};

function AIChat() {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: 'Hello! I am your AI assistant. I\'m powered by Google Gemini and ready to help you.', 
      sender: 'ai' 
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState('mistral');
  const [useOfflineMode, setUseOfflineMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Custom API settings
  const [apiProvider, setApiProvider] = useState('gemini'); // 'huggingface', 'gemini', 'openai', 'offline'
  const [geminiApiKey, setGeminiApiKey] = useState('YOUR_GEMINI_API_KEY_HERE');
  const [geminiModel, setGeminiModel] = useState('gemini-1.5-flash');
  const [openaiApiKey, setOpenaiApiKey] = useState('YOUR_OPENAI_API_KEY_HERE');
  const [openaiModel, setOpenaiModel] = useState('gpt-3.5-turbo');
  const [savedSettings, setSavedSettings] = useState({
    apiProvider: 'gemini',
    geminiApiKey: 'YOUR_GEMINI_API_KEY_HERE',
    geminiModel: 'gemini-1.5-flash',
    openaiApiKey: 'YOUR_OPENAI_API_KEY_HERE',
    openaiModel: 'gpt-3.5-turbo'
  });
  
  const chatAreaRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Apply saved settings when component mounts
  useEffect(() => {
    // Try to get saved settings from localStorage
    try {
      const savedApiSettings = localStorage.getItem('aiChatSettings');
      if (savedApiSettings) {
        const parsedSettings = JSON.parse(savedApiSettings);
        // Ensure OpenAI key is always set
        if (!parsedSettings.openaiApiKey) {
          parsedSettings.openaiApiKey = 'YOUR_OPENAI_API_KEY_HERE';
        }
        setSavedSettings(parsedSettings);
        setApiProvider(parsedSettings.apiProvider);
        setGeminiApiKey(parsedSettings.geminiApiKey || '');
        setGeminiModel(parsedSettings.geminiModel || 'gemini-1.5-flash');
        setOpenaiApiKey(parsedSettings.openaiApiKey);
        setOpenaiModel(parsedSettings.openaiModel || 'gpt-3.5-turbo');
        
        // Auto-set offline mode if that was the saved preference
        if (parsedSettings.apiProvider === 'offline') {
          setUseOfflineMode(true);
        }
      } else {
        // If no settings exist yet, save the default ones with the hardcoded API key
        localStorage.setItem('aiChatSettings', JSON.stringify(savedSettings));
      }
    } catch (error) {
      console.error('Error loading saved settings:', error);
    }
  }, []);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user'
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    
    // If user has enabled offline mode, skip API call
    if (useOfflineMode || savedSettings.apiProvider === 'offline') {
      simulateResponse(inputText);
      return;
    }
    
    try {
      let responseText = '';
      
      // Determine which API to use
      if (savedSettings.apiProvider === 'openai' && savedSettings.openaiApiKey) {
        // Call OpenAI API
        const openaiResponse = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: savedSettings.openaiModel,
            messages: [
              { role: 'system', content: 'You are a helpful assistant.' },
              ...messages.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text
              })),
              { role: 'user', content: inputText }
            ],
            temperature: 0.7,
            max_tokens: 500
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${savedSettings.openaiApiKey}`
            },
            timeout: 30000
          }
        );
        
        if (openaiResponse.data && 
            openaiResponse.data.choices && 
            openaiResponse.data.choices[0] &&
            openaiResponse.data.choices[0].message) {
          responseText = openaiResponse.data.choices[0].message.content;
        } else {
          responseText = "I couldn't process that response. Please try again.";
        }
      } else if (savedSettings.apiProvider === 'gemini' && savedSettings.geminiApiKey) {
        // Call Google Gemini API
        const geminiResponse = await axios.post(
          'https://generativelanguage.googleapis.com/v1beta/models/' + savedSettings.geminiModel + ':generateContent',
          {
            contents: [
              {
                parts: [
                  { text: inputText }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 800,
              topP: 0.95,
              topK: 40
            }
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            params: {
              key: savedSettings.geminiApiKey
            },
            timeout: 30000
          }
        );
        
        if (geminiResponse.data && 
            geminiResponse.data.candidates && 
            geminiResponse.data.candidates[0] &&
            geminiResponse.data.candidates[0].content &&
            geminiResponse.data.candidates[0].content.parts) {
          responseText = geminiResponse.data.candidates[0].content.parts[0].text;
        } else {
          responseText = "I couldn't process the Gemini response. Please try again.";
        }
      } else {
        // Call the selected Hugging Face model API
        const response = await axios.post(
          API_ENDPOINTS[selectedModel],
          { inputs: inputText },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 15000, // 15 second timeout
          }
        );
        
        // Process the response based on the model
        if (response.data && response.data.generated_text) {
          responseText = response.data.generated_text;
        } else if (Array.isArray(response.data)) {
          responseText = response.data[0].generated_text;
        } else {
          responseText = "I'm sorry, I couldn't generate a response. Please try again.";
        }
      }
      
      // Add AI response
      const aiMessage = {
        id: Date.now(),
        text: responseText,
        sender: 'ai'
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error calling AI API:', error);
      
      // Falling back to local responses
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "The primary API is unavailable. Using offline response mode...",
        sender: 'ai'
      }]);
      
      simulateResponse(inputText);
    } finally {
      setTimeout(() => {
        setIsTyping(false);
      }, 500);
    }
  };
  
  const simulateResponse = (input) => {
    // Simulate typing delay proportional to message length
    const typingDelay = Math.min(1500, 500 + input.length * 20);
    
    setTimeout(() => {
      const smartResponse = getSmartMockResponse(input);
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: smartResponse,
        sender: 'ai'
      }]);
      setIsTyping(false);
    }, typingDelay);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const handleSaveSettings = () => {
    const newSettings = {
      apiProvider,
      geminiApiKey,
      geminiModel,
      openaiApiKey,
      openaiModel
    };
    
    setSavedSettings(newSettings);
    
    // Save to localStorage for persistence
    try {
      localStorage.setItem('aiChatSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
    
    // Update mode based on provider
    if (apiProvider === 'offline') {
      setUseOfflineMode(true);
    } else {
      setUseOfflineMode(false);
    }
    
    setShowSettings(false);
  };
  
  const handleCancelSettings = () => {
    // Reset form to saved values
    setApiProvider(savedSettings.apiProvider);
    setGeminiApiKey(savedSettings.geminiApiKey || '');
    setGeminiModel(savedSettings.geminiModel || 'gemini-1.5-flash');
    setOpenaiApiKey(savedSettings.openaiApiKey || '');
    setOpenaiModel(savedSettings.openaiModel || 'gpt-3.5-turbo');
    setShowSettings(false);
  };

  return (
    <Container>
      <Header>
        <Title>Private AI Assistant</Title>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{ fontSize: '12px', marginRight: '10px', userSelect: 'none' }}>
            <input 
              type="checkbox" 
              checked={useOfflineMode || savedSettings.apiProvider === 'offline'} 
              onChange={(e) => setUseOfflineMode(e.target.checked)}
              style={{ marginRight: '5px' }}
            />
            Offline Mode
          </label>
          {savedSettings.apiProvider === 'huggingface' && !useOfflineMode && (
            <ModelSelector 
              value={selectedModel} 
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={useOfflineMode || savedSettings.apiProvider !== 'huggingface'}
            >
              <option value="mistral">Mistral-7B</option>
              <option value="gemma">Gemma-7B</option>
              <option value="llama">Llama-2-7B</option>
            </ModelSelector>
          )}
          {savedSettings.apiProvider === 'openai' && !useOfflineMode && (
            <div style={{ color: '#99ccff', fontSize: '12px', marginRight: '10px' }}>
              Using {OPENAI_MODELS.find(m => m.id === savedSettings.openaiModel)?.name || 'ChatGPT'}
            </div>
          )}
          {savedSettings.apiProvider === 'gemini' && !useOfflineMode && (
            <div style={{ color: '#99ccff', fontSize: '12px', marginRight: '10px' }}>
              Using {GEMINI_MODELS.find(m => m.id === savedSettings.geminiModel)?.name || 'Gemini'}
            </div>
          )}
          <SettingsButton onClick={() => setShowSettings(true)}>⚙️</SettingsButton>
        </div>
      </Header>
      
      <Warning>
        {useOfflineMode || savedSettings.apiProvider === 'offline'
          ? "Using offline mode. Responses are generated locally for better privacy."
          : savedSettings.apiProvider === 'openai'
            ? "Using OpenAI API with your key. Messages are sent to OpenAI servers."
            : savedSettings.apiProvider === 'gemini'
              ? "Using Google Gemini API with your key. Messages are sent to Google AI servers."
              : "Using free Hugging Face API. Your conversations are not stored locally, and responses may be slow."}
        For workplace privacy, minimize this window when not in use.
      </Warning>
      
      <ChatArea ref={chatAreaRef}>
        {messages.map(message => (
          <Message key={message.id} sender={message.sender}>
            {message.text}
          </Message>
        ))}
        {isTyping && <Typing>AI is typing...</Typing>}
      </ChatArea>
      
      <InputArea>
        <MessageInput
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          disabled={isTyping}
        />
        <SendButton onClick={handleSend} disabled={isTyping || !inputText.trim()}>
          Send
        </SendButton>
      </InputArea>
      
      {/* Settings Modal */}
      <SettingsModal show={showSettings}>
        <SettingsTitle>AI Assistant Settings</SettingsTitle>
        
        <SettingsField>
          <Label>Choose AI Provider:</Label>
          <RadioGroup>
            <RadioOption>
              <input 
                type="radio" 
                value="huggingface" 
                checked={apiProvider === 'huggingface'} 
                onChange={() => setApiProvider('huggingface')}
              />
              Hugging Face (Free)
            </RadioOption>
            <RadioOption>
              <input 
                type="radio" 
                value="gemini" 
                checked={apiProvider === 'gemini'} 
                onChange={() => setApiProvider('gemini')}
              />
              Google Gemini (Free API Key)
            </RadioOption>
            <RadioOption>
              <input 
                type="radio" 
                value="openai" 
                checked={apiProvider === 'openai'} 
                onChange={() => setApiProvider('openai')}
              />
              OpenAI (Paid API Key)
            </RadioOption>
            <RadioOption>
              <input 
                type="radio" 
                value="offline" 
                checked={apiProvider === 'offline'} 
                onChange={() => setApiProvider('offline')}
              />
              Offline Mode
            </RadioOption>
          </RadioGroup>
        </SettingsField>
        
        {apiProvider === 'gemini' && (
          <>
            <SettingsField>
              <Label>Google Gemini API Key:</Label>
              <Input 
                type="password" 
                value={geminiApiKey} 
                onChange={(e) => setGeminiApiKey(e.target.value)} 
                placeholder="Your Gemini API Key"
              />
              <div style={{ fontSize: '12px', color: '#aaa', marginTop: '5px' }}>
                Get a free API key from <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" style={{ color: '#99ccff' }}>Google AI Studio</a>. Your key is stored locally in your browser only.
              </div>
            </SettingsField>
            
            <SettingsField>
              <Label>Gemini Model:</Label>
              <ModelSelector 
                value={geminiModel} 
                onChange={(e) => setGeminiModel(e.target.value)}
              >
                {GEMINI_MODELS.map(model => (
                  <option key={model.id} value={model.id}>{model.name}</option>
                ))}
              </ModelSelector>
              <div style={{ fontSize: '12px', color: '#aaa', marginTop: '5px' }}>
                All models are available on the free tier with limited usage.
              </div>
            </SettingsField>
          </>
        )}
        
        {apiProvider === 'openai' && (
          <>
            <SettingsField>
              <Label>OpenAI API Key:</Label>
              <Input 
                type="password" 
                value={openaiApiKey} 
                onChange={(e) => setOpenaiApiKey(e.target.value)} 
                placeholder="sk-..."
              />
              <div style={{ fontSize: '12px', color: '#aaa', marginTop: '5px' }}>
                Your API key is stored locally in your browser and never sent to our servers.
              </div>
            </SettingsField>
            
            <SettingsField>
              <Label>OpenAI Model:</Label>
              <ModelSelector 
                value={openaiModel} 
                onChange={(e) => setOpenaiModel(e.target.value)}
              >
                {OPENAI_MODELS.map(model => (
                  <option key={model.id} value={model.id}>{model.name}</option>
                ))}
              </ModelSelector>
              <div style={{ fontSize: '12px', color: '#aaa', marginTop: '5px' }}>
                Different models have different capabilities and costs. Check OpenAI's pricing.
              </div>
            </SettingsField>
          </>
        )}
        
        <ButtonRow>
          <Button onClick={handleCancelSettings}>Cancel</Button>
          <Button primary onClick={handleSaveSettings}>Save Settings</Button>
        </ButtonRow>
      </SettingsModal>
    </Container>
  );
}

export default AIChat; 