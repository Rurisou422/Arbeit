import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../services/auth.service';
import styled from 'styled-components';

const FormContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const Button = styled.button`
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #0069d9;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 14px;
  margin-top: 10px;
  padding: 8px;
  background-color: #f8d7da;
  border-radius: 4px;
  border: 1px solid #f5c6cb;
`;

const LinkContainer = styled.div`
  margin-top: 15px;
  text-align: center;
  font-size: 14px;
  
  a {
    color: #007bff;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const { email, password } = formData;
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Bitte füllen Sie alle Felder aus');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      await login({ email, password });
      
      // Bei erfolgreicher Anmeldung zur Hauptseite navigieren
      navigate('/');
    } catch (err) {
      setError(err.message || 'Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Anmeldedaten.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <FormContainer>
      <h2>Anmelden</h2>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="email">E-Mail-Adresse</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="name@example.com"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="password">Passwort</Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
            placeholder="Passwort eingeben"
            required
          />
        </FormGroup>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Button type="submit" disabled={loading}>
          {loading ? 'Wird angemeldet...' : 'Anmelden'}
        </Button>
      </Form>
      
      <LinkContainer>
        <p>Noch kein Konto? <Link to="/register">Jetzt registrieren</Link></p>
        <p><Link to="/forgot-password">Passwort vergessen?</Link></p>
      </LinkContainer>
    </FormContainer>
  );
};

export default LoginForm; 