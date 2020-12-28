import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { useMessageDispatch } from '../../context/message';
import SEND_MESSAGE from '../../graphql/mutations/sendMessage';

const MessageForm = ({ selectedUser }) => {
  const dispatch = useMessageDispatch();
  const [message, setMessage] = useState('');

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onError: (err) => console.log(err),
    onCompleted: (data) => {
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          username: selectedUser.username,
          message: data.sendMessage,
        },
      });
    },
  });

  const handleSubmitClick = (event) => {
    event.preventDefault();

    if (message.trim() === '') {
      return;
    } else {
      sendMessage({
        variables: { to: selectedUser.username, content: message },
      });

      setMessage('');
    }
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  return (
    <Form onSubmit={handleSubmitClick} className="formContainer">
      <Form.Group className="d-flex align-items-center formContainer__form">
        <Form.Control
          type="text"
          className="formContainer__form__input p-4 rounded-pill bg-secondary border-0 m-0"
          placeholder="Type a message..."
          value={message}
          onChange={handleMessageChange}
        />
        <i
          className="fas fa-paper-plane fa-2x text-primary m1-2"
          role="button"
        ></i>
      </Form.Group>
    </Form>
  );
};

export default MessageForm;
