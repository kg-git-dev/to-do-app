import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Grid, Header, Input } from 'semantic-ui-react';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:3000/auth/register', { username, password });
      alert('User registered successfully!');
    } catch (error) {
      alert('Error registering user.');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', { username, password });
      localStorage.setItem('token', response.data.token);
      navigate('/tasks');
    } catch (error) {
      alert('Error logging in.');
    }
  };

  return (
      <Grid centered columns={2}>
        <Grid.Row >
          <Grid.Column style={{
            marginTop: '40px', marginBottom: '10px'
          }}>
            <Header as='h2' textAlign='center'>Register or Log in</Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Form>
              <Form.Field>
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Field>
              <Form.Field>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Field>
              <Button.Group>
                <Button onClick={handleRegister} primary>Register</Button>
                <Button.Or />
                <Button positive onClick={handleLogin}>Login</Button>
              </Button.Group>
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
  );
};

export default LoginForm;
