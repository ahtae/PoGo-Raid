import React, { useState } from 'react';
import { Row, Col, Form, Button, FormText } from 'react-bootstrap';
import { gql, useLazyQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { useAuthDispatch } from '../context/auth';

const LOGIN_USER = gql`
  query login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      username
      email
      createdAt
      token
    }
  }
`;

const Login = ({ history }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const dispatch = useAuthDispatch();

  const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
    onError: (err) => setErrors(err.graphQLErrors[0].extensions.errors),
    onCompleted: (data) => {
      dispatch({
        type: 'LOGIN',
        payload: data.login,
      });
      history.push('/');
    },
  });

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmitClick = (event) => {
    event.preventDefault();

    const data = {
      username,
      password,
    };

    loginUser({
      variables: data,
    });
  };

  return (
    <Row className="bg-white py-5 justify-content-center">
      <Col sm={8} md={6} lg={4}>
        <h1 className="text-center">Login</h1>
        <Form onSubmit={handleSubmitClick}>
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={username}
              className={errors.username && 'is-invalid'}
              onChange={handleUsernameChange}
            />
            <FormText style={{ color: 'red' }}>
              {errors.username ? errors.username : ''}
            </FormText>
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              className={errors.password && 'is-invalid'}
              value={password}
              onChange={handlePasswordChange}
            />
            <FormText style={{ color: 'red' }}>
              {errors.password ? errors.password : ''}
            </FormText>
          </Form.Group>
          <div className="text-center">
            <Button variant="success" type="submit" disabled={loading}>
              Login
            </Button>
            <p style={{ margin: '10px' }}>
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </Form>
      </Col>
    </Row>
  );
};

export default Login;
