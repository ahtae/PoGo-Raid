import React, { useState } from 'react';
import { Row, Col, Form, Button, FormText } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { useAuthDispatch } from '../context/auth';
import LOGIN_USER from '../graphql/mutations/loginUser';

const Login = ({ history }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const dispatch = useAuthDispatch();

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    onError: (err) => setErrors(err.graphQLErrors[0].extensions.errors),
    onCompleted: (data) => {
      dispatch({
        type: 'LOGIN',
        payload: data.login,
      });

      history.push('/dashboard');
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
      <Col sm={8} md={6} lg={4} className="formContainer">
        <h1 className="text-center">Login</h1>
        <Form onSubmit={handleSubmitClick} className="formContainer__form">
          <Form.Group className="formContainer__form__formGroup">
            {' '}
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={username}
              className={errors && errors.username && 'is-invalid'}
              onChange={handleUsernameChange}
            />
            <FormText className="formContainer__form__formGroup__error">
              {errors && errors.username ? errors.username : ''}
            </FormText>
          </Form.Group>
          <Form.Group className="formContainer__form__formGroup">
            {' '}
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              className={errors && errors.password && 'is-invalid'}
              value={password}
              onChange={handlePasswordChange}
            />
            <FormText className="formContainer__form__formGroup__error">
              {errors && errors.password ? errors.password : ''}
            </FormText>
          </Form.Group>
          <div className="text-center">
            <Button variant="success" type="submit" disabled={loading}>
              Login
            </Button>
            <p className="py-2">
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </Form>
      </Col>
    </Row>
  );
};

export default Login;
