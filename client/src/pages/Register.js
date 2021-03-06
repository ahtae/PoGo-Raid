import React, { useState } from 'react';
import { Row, Col, Form, Button, FormText } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import REGISTER_USER from '../graphql/mutations/registerUser';

const Register = ({ history }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update: (_, __) => history.push('/dashboard'),
    onError: (err) => setErrors(err.graphQLErrors[0].extensions.errors),
  });

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmitClick = (event) => {
    event.preventDefault();

    const data = {
      username,
      email,
      password,
      confirmPassword,
    };

    registerUser({
      variables: data,
    });
  };

  return (
    <Row className="bg-white py-5 justify-content-center">
      <Col sm={8} md={6} lg={4} className="formContainer">
        <h1 className="text-center">Register</h1>
        <Form onSubmit={handleSubmitClick} className="formContainer__form">
          <Form.Group className="formContainer__form__formGroup">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              value={email}
              className={errors.email && 'is-invalid'}
              onChange={handleEmailChange}
            />
            <FormText className="formContainer__form__formGroup__error">
              {errors.email ? errors.email : ''}
            </FormText>
          </Form.Group>
          <Form.Group className="formContainer__form__formGroup">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={username}
              className={errors.username && 'is-invalid'}
              onChange={handleUsernameChange}
            />
            <FormText className="formContainer__form__formGroup__error">
              {errors.username ? errors.username : ''}
            </FormText>
          </Form.Group>
          <Form.Group className="formContainer__form__formGroup">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              className={errors.password && 'is-invalid'}
              value={password}
              onChange={handlePasswordChange}
            />
            <FormText className="formContainer__form__formGroup__error">
              {errors.password ? errors.password : ''}
            </FormText>
          </Form.Group>
          <Form.Group className="formContainer__form__formGroup">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              className={errors.confirmPassword && 'is-invalid'}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            <FormText className="formContainer__form__formGroup__error">
              {errors.confirmPassword ? errors.confirmPassword : ''}
            </FormText>
          </Form.Group>
          <div className="text-center">
            <Button variant="success" type="submit" disabled={loading}>
              Register
            </Button>
            <p className="py-2">
              Have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </Form>
      </Col>
    </Row>
  );
};

export default Register;
