import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../services/auth.service';
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

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const { name, email, password, confirmPassword } = formData;
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const validateForm = () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Bitte füllen Sie alle Felder aus');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('Die Passwörter stimmen nicht überein');
      return false;
    }
    
    if (password.length < 6) {
      setError('Das Passwort muss mindestens 6 Zeichen lang sein');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Bitte geben Sie eine gültige E-Mail-Adresse ein');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Registrierungsdaten ohne confirmPassword senden
      const registerData = {
        name,
        email,
        password
      };
      
      await register(registerData);
      
      // Bei erfolgreicher Registrierung zur Hauptseite navigieren
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registrierung fehlgeschlagen. Bitte versuchen Sie es später erneut.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <FormContainer>
      <h2>Registrieren</h2>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={handleChange}
            placeholder="Ihr vollständiger Name"
            required
          />
        </FormGroup>
        
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
        
        <FormGroup>
          <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
          <Input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
            placeholder="Passwort wiederholen"
            required
          />
        </FormGroup>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Button type="submit" disabled={loading}>
          {loading ? 'Registrierung läuft...' : 'Registrieren'}
        </Button>
      </Form>
      
      <LinkContainer>
        <p>Bereits registriert? <Link to="/login">Jetzt anmelden</Link></p>
      </LinkContainer>
    </FormContainer>
  );
};

export default RegisterForm; 