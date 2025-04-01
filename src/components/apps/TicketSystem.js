import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #1a1a1a;
  color: white;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #2a2a2a;
  border-bottom: 1px solid #3a3a3a;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 18px;
`;

const ContentArea = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: #252525;
  border-right: 1px solid #3a3a3a;
  overflow-y: auto;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TicketList = styled.div`
  display: flex;
  flex-direction: column;
`;

const TicketItem = styled.div`
  padding: 12px 15px;
  border-bottom: 1px solid #333;
  cursor: pointer;
  background-color: ${props => props.selected ? '#3a3a3a' : 'transparent'};
  
  &:hover {
    background-color: ${props => props.selected ? '#3a3a3a' : '#303030'};
  }
`;

const TicketTitle = styled.div`
  font-weight: ${props => props.unread ? 'bold' : 'normal'};
  margin-bottom: 4px;
`;

const TicketMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #aaa;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: bold;
  margin-left: 8px;
  background-color: ${props => 
    props.status === 'offen' ? '#2a652a' : 
    props.status === 'in-bearbeitung' ? '#7d5c00' : 
    props.status === 'wartend' ? '#7d008d' : 
    props.status === 'geschlossen' ? '#555' : '#333'};
`;

const PriorityBadge = styled.span`
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: bold;
  margin-left: 8px;
  background-color: ${props => 
    props.priority === 'hoch' ? '#a22' : 
    props.priority === 'mittel' ? '#a85' : 
    props.priority === 'niedrig' ? '#285' : '#333'};
`;

const DetailView = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

const NoSelection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #777;
  font-size: 18px;
`;

const TicketHeader = styled.div`
  margin-bottom: 20px;
`;

const TicketDescription = styled.div`
  background-color: #262626;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 20px;
  border-left: 4px solid #0078d7;
`;

const TaskList = styled.div`
  margin-bottom: 20px;
`;

const TaskItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #333;
`;

const TaskCheckbox = styled.input.attrs({ type: 'checkbox' })`
  margin-right: 10px;
`;

const TaskText = styled.div`
  flex: 1;
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  color: ${props => props.completed ? '#777' : 'white'};
`;

const Button = styled.button`
  background-color: ${props => props.primary ? '#0078d7' : '#333'};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  margin-right: 10px;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.primary ? '#1683d8' : '#444'};
  }
`;

const ActionBar = styled.div`
  display: flex;
  padding: 15px;
  background-color: #252525;
  border-top: 1px solid #333;
`;

const TextInput = styled.input`
  background-color: #333;
  color: white;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 8px 10px;
  width: 100%;
  margin-bottom: 15px;
  
  &:focus {
    outline: none;
    border-color: #0078d7;
  }
`;

const TextArea = styled.textarea`
  background-color: #333;
  color: white;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 8px 10px;
  width: 100%;
  margin-bottom: 15px;
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: #0078d7;
  }
`;

const Select = styled.select`
  background-color: #333;
  color: white;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 8px 10px;
  width: 100%;
  margin-bottom: 15px;
  
  &:focus {
    outline: none;
    border-color: #0078d7;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: #ddd;
`;

const Modal = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #252525;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
  max-height: 90%;
  overflow-y: auto;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #aaa;
  font-size: 20px;
  cursor: pointer;
  
  &:hover {
    color: white;
  }
`;

const SearchBar = styled.div`
  padding: 10px;
  border-bottom: 1px solid #333;
`;

const SearchInput = styled.input`
  background-color: #333;
  color: white;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 8px 10px;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: #0078d7;
  }
`;

const NewTaskInput = styled.div`
  display: flex;
  margin-top: 15px;
  margin-bottom: 10px;
`;

const TaskInput = styled.input`
  flex: 1;
  background-color: #333;
  color: white;
  border: 1px solid #444;
  border-radius: 4px 0 0 4px;
  padding: 8px 10px;
  
  &:focus {
    outline: none;
    border-color: #0078d7;
  }
`;

const AddTaskButton = styled.button`
  background-color: #0078d7;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  padding: 8px 16px;
  cursor: pointer;
  
  &:hover {
    background-color: #1683d8;
  }
`;

function TicketSystem() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  
  // New ticket form fields
  const [newTicket, setNewTicket] = useState({
    title: '',
    customer: '',
    status: 'offen',
    priority: 'mittel',
    description: '',
    tasks: []
  });
  
  useEffect(() => {
    // Clear existing data in localStorage and start fresh
    localStorage.removeItem('ticketSystemData');
    localStorage.setItem('ticketSystemData', JSON.stringify([]));
    setTickets([]);
  }, []);
  
  // Save tickets to localStorage whenever they change
  useEffect(() => {
    if (tickets.length > 0) {
      localStorage.setItem('ticketSystemData', JSON.stringify(tickets));
    }
  }, [tickets]);
  
  const filteredTickets = tickets.filter(ticket => 
    ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const selectedTicket = tickets.find(ticket => ticket.id === selectedTicketId);
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleTicketSelect = (ticketId) => {
    setSelectedTicketId(ticketId);
  };
  
  const handleStatusChange = (newStatus) => {
    if (!selectedTicket) return;
    
    const updatedTickets = tickets.map(ticket => 
      ticket.id === selectedTicket.id
        ? { ...ticket, status: newStatus }
        : ticket
    );
    
    setTickets(updatedTickets);
  };
  
  const handlePriorityChange = (newPriority) => {
    if (!selectedTicket) return;
    
    const updatedTickets = tickets.map(ticket => 
      ticket.id === selectedTicket.id
        ? { ...ticket, priority: newPriority }
        : ticket
    );
    
    setTickets(updatedTickets);
  };
  
  const handleTaskToggle = (taskId) => {
    if (!selectedTicket) return;
    
    const updatedTasks = selectedTicket.tasks.map(task => 
      task.id === taskId
        ? { ...task, completed: !task.completed }
        : task
    );
    
    const updatedTickets = tickets.map(ticket => 
      ticket.id === selectedTicket.id
        ? { ...ticket, tasks: updatedTasks }
        : ticket
    );
    
    setTickets(updatedTickets);
  };
  
  const handleAddTask = () => {
    if (!selectedTicket || !newTaskText.trim()) return;
    
    const newTask = {
      id: Math.max(0, ...selectedTicket.tasks.map(t => t.id)) + 1,
      text: newTaskText,
      completed: false
    };
    
    const updatedTickets = tickets.map(ticket => 
      ticket.id === selectedTicket.id
        ? { ...ticket, tasks: [...ticket.tasks, newTask] }
        : ticket
    );
    
    setTickets(updatedTickets);
    setNewTaskText('');
  };
  
  const handleDeleteTask = (taskId) => {
    if (!selectedTicket) return;
    
    const updatedTasks = selectedTicket.tasks.filter(task => task.id !== taskId);
    
    const updatedTickets = tickets.map(ticket => 
      ticket.id === selectedTicket.id
        ? { ...ticket, tasks: updatedTasks }
        : ticket
    );
    
    setTickets(updatedTickets);
  };
  
  const handleDeleteTicket = () => {
    if (!selectedTicket) return;
    
    if (window.confirm('Sind Sie sicher, dass Sie dieses Ticket löschen möchten?')) {
      const updatedTickets = tickets.filter(ticket => ticket.id !== selectedTicket.id);
      setTickets(updatedTickets);
      setSelectedTicketId(null);
    }
  };
  
  const handleNewTicketChange = (field, value) => {
    setNewTicket(prev => ({ ...prev, [field]: value }));
  };
  
  const handleCreateTicket = () => {
    // Validate form
    if (!newTicket.title.trim() || !newTicket.customer.trim() || !newTicket.description.trim()) {
      alert('Bitte füllen Sie alle erforderlichen Felder aus');
      return;
    }
    
    const newTicketObject = {
      ...newTicket,
      id: Math.max(0, ...tickets.map(t => t.id)) + 1,
      createdAt: new Date().toISOString().split('T')[0],
      tasks: []
    };
    
    setTickets([newTicketObject, ...tickets]);
    setShowModal(false);
    setSelectedTicketId(newTicketObject.id);
    
    // Reset form
    setNewTicket({
      title: '',
      customer: '',
      status: 'offen',
      priority: 'mittel',
      description: '',
      tasks: []
    });
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <Container>
      <Header>
        <Title>IT-Support Ticketsystem</Title>
        <Button primary onClick={() => setShowModal(true)}>Neues Ticket</Button>
      </Header>
      
      <ContentArea>
        <Sidebar>
          <SearchBar>
            <SearchInput 
              type="text" 
              placeholder="Tickets durchsuchen..." 
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </SearchBar>
          
          <TicketList>
            {filteredTickets.map(ticket => (
              <TicketItem 
                key={ticket.id} 
                selected={selectedTicketId === ticket.id}
                onClick={() => handleTicketSelect(ticket.id)}
              >
                <TicketTitle unread={ticket.status === 'offen'}>
                  {ticket.title}
                </TicketTitle>
                <TicketMeta>
                  <div>{ticket.customer}</div>
                  <div>{formatDate(ticket.createdAt)}</div>
                </TicketMeta>
                <TicketMeta>
                  <div>
                    <StatusBadge status={ticket.status}>
                      {ticket.status === 'in-bearbeitung' ? 'IN BEARBEITUNG' : 
                        ticket.status.toUpperCase()}
                    </StatusBadge>
                    <PriorityBadge priority={ticket.priority}>
                      {ticket.priority.toUpperCase()}
                    </PriorityBadge>
                  </div>
                  <div>Aufgaben: {ticket.tasks.filter(t => t.completed).length}/{ticket.tasks.length}</div>
                </TicketMeta>
              </TicketItem>
            ))}
            
            {filteredTickets.length === 0 && (
              <div style={{ padding: '20px', textAlign: 'center', color: '#777' }}>
                Keine Tickets gefunden
              </div>
            )}
          </TicketList>
        </Sidebar>
        
        <MainContent>
          {selectedTicket ? (
            <>
              <DetailView>
                <TicketHeader>
                  <h2>{selectedTicket.title}</h2>
                  <div style={{ display: 'flex', marginBottom: '5px' }}>
                    <div style={{ flex: 1 }}>
                      <strong>Kunde/Abteilung:</strong> {selectedTicket.customer}
                    </div>
                    <div>
                      <strong>Erstellt am:</strong> {formatDate(selectedTicket.createdAt)}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', marginTop: '10px' }}>
                    <div style={{ marginRight: '20px' }}>
                      <Label>Status:</Label>
                      <Select 
                        value={selectedTicket.status} 
                        onChange={(e) => handleStatusChange(e.target.value)}
                      >
                        <option value="offen">Offen</option>
                        <option value="in-bearbeitung">In Bearbeitung</option>
                        <option value="wartend">Wartend</option>
                        <option value="geschlossen">Geschlossen</option>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Priorität:</Label>
                      <Select 
                        value={selectedTicket.priority} 
                        onChange={(e) => handlePriorityChange(e.target.value)}
                      >
                        <option value="hoch">Hoch</option>
                        <option value="mittel">Mittel</option>
                        <option value="niedrig">Niedrig</option>
                      </Select>
                    </div>
                  </div>
                </TicketHeader>
                
                <Label>Beschreibung:</Label>
                <TicketDescription>
                  {selectedTicket.description}
                </TicketDescription>
                
                <Label>Aufgaben:</Label>
                <TaskList>
                  {selectedTicket.tasks.map(task => (
                    <TaskItem key={task.id}>
                      <TaskCheckbox 
                        checked={task.completed} 
                        onChange={() => handleTaskToggle(task.id)}
                      />
                      <TaskText completed={task.completed}>{task.text}</TaskText>
                      <Button onClick={() => handleDeleteTask(task.id)}>×</Button>
                    </TaskItem>
                  ))}
                  
                  {selectedTicket.tasks.length === 0 && (
                    <div style={{ padding: '10px 0', color: '#777' }}>
                      Noch keine Aufgaben hinzugefügt
                    </div>
                  )}
                  
                  <NewTaskInput>
                    <TaskInput 
                      type="text" 
                      placeholder="Neue Aufgabe hinzufügen..." 
                      value={newTaskText}
                      onChange={(e) => setNewTaskText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                    />
                    <AddTaskButton onClick={handleAddTask}>Hinzufügen</AddTaskButton>
                  </NewTaskInput>
                </TaskList>
              </DetailView>
              
              <ActionBar>
                <Button onClick={handleDeleteTicket}>Ticket löschen</Button>
              </ActionBar>
            </>
          ) : (
            <NoSelection>
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>📋</div>
              <div>Wählen Sie ein Ticket aus oder erstellen Sie ein neues</div>
            </NoSelection>
          )}
        </MainContent>
      </ContentArea>
      
      {/* New Ticket Modal */}
      {showModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <h3 style={{ margin: 0 }}>Neues Ticket erstellen</h3>
              <CloseButton onClick={() => setShowModal(false)}>×</CloseButton>
            </ModalHeader>
            
            <div>
              <Label>Ticket-Titel:</Label>
              <TextInput 
                type="text" 
                value={newTicket.title}
                onChange={(e) => handleNewTicketChange('title', e.target.value)}
                placeholder="Kurze Beschreibung des Problems"
              />
              
              <Label>Kunde/Abteilung:</Label>
              <TextInput 
                type="text" 
                value={newTicket.customer}
                onChange={(e) => handleNewTicketChange('customer', e.target.value)}
                placeholder="Wer hat das Problem gemeldet"
              />
              
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <Label>Status:</Label>
                  <Select 
                    value={newTicket.status}
                    onChange={(e) => handleNewTicketChange('status', e.target.value)}
                  >
                    <option value="offen">Offen</option>
                    <option value="in-bearbeitung">In Bearbeitung</option>
                    <option value="wartend">Wartend</option>
                    <option value="geschlossen">Geschlossen</option>
                  </Select>
                </div>
                
                <div style={{ flex: 1 }}>
                  <Label>Priorität:</Label>
                  <Select 
                    value={newTicket.priority}
                    onChange={(e) => handleNewTicketChange('priority', e.target.value)}
                  >
                    <option value="hoch">Hoch</option>
                    <option value="mittel">Mittel</option>
                    <option value="niedrig">Niedrig</option>
                  </Select>
                </div>
              </div>
              
              <Label>Beschreibung:</Label>
              <TextArea 
                value={newTicket.description}
                onChange={(e) => handleNewTicketChange('description', e.target.value)}
                placeholder="Detaillierte Beschreibung des Problems"
              />
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <Button onClick={() => setShowModal(false)}>Abbrechen</Button>
                <Button primary onClick={handleCreateTicket}>Ticket erstellen</Button>
              </div>
            </div>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}

export default TicketSystem; 