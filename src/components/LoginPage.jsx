import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const LoginContainer = styled.div`
  max-width: 400px;
  margin: 100px auto;
  padding: 30px;
  background: linear-gradient(145deg, #f6f8fa 0%, #ffffff 100%);
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
`;

const LoginHeader = styled.h1`
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
  font-weight: 600;
  position: relative;
  padding-bottom: 15px;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #4CAF50, #8BC34A);
    border-radius: 2px;
  }
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #2c3e50;
  font-size: 0.95rem;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
  outline: none;
  
  &:focus {
    border-color: #4CAF50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
  }
  
  &:hover {
    border-color: #8BC34A;
  }
`;

const LoginButton = styled.button`
  padding: 14px 24px;
  background: linear-gradient(90deg, #4CAF50, #8BC34A);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: linear-gradient(90deg, #43A047, #7CB342);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  background-color: #fdecea;
  padding: 10px;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 10px;
`;

const LoginPage = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // For now, we'll use a simple check for demo purposes
      // In a real application, this should be replaced with a proper API call
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        // Store authentication state in localStorage or sessionStorage
        localStorage.setItem('adminAuthenticated', 'true');
        navigate('/admin');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginHeader>Admin Login</LoginHeader>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <LoginForm onSubmit={handleSubmit}>
        <FormField>
          <Label htmlFor="username">Username</Label>
          <Input
            type="text"
            id="username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
          />
        </FormField>
        <FormField>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </FormField>
        <LoginButton type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </LoginButton>
      </LoginForm>
    </LoginContainer>
  );
};

export default LoginPage;