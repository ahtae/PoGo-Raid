import React, { useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useAuthDispatch, useAuthState } from '../context/auth';
import { useMessageDispatch } from '../context/message';
import { Users, Messages } from '../components';
import { useSubscription } from '@apollo/client';
import NEW_MESSAGE from '../graphql/subscriptions/newMessage';
import NEW_REACTION from '../graphql/subscriptions/newReaction';
import '../App.scss';

const Dashboard = () => {
  const { user } = useAuthState();
  const authDispatch = useAuthDispatch();
  const messageDispatch = useMessageDispatch();
  const { data: messageData, error: messageError } = useSubscription(
    NEW_MESSAGE
  );
  const { data: reactionData, error: reactionError } = useSubscription(
    NEW_REACTION
  );

  useEffect(() => {
    if (messageData) {
      const message = messageData.newMessage;
      const otherUser =
        user.username === message.to ? message.from : message.to;

      messageDispatch({
        type: 'ADD_MESSAGE',
        payload: {
          username: otherUser,
          message: message,
        },
      });
    }
  }, [messageData]);

  useEffect(() => {
    if (reactionData) {
      const reaction = reactionData.newReaction;

      messageDispatch({
        type: 'ADD_REACTION',
        payload: {
          user: reaction.user,
          reaction,
          message: reaction.message,
        },
      });
    }
  }, [reactionData]);

  const logout = () => {
    authDispatch({ type: 'LOG_OUT' });

    window.location.href = '/';
  };

  return (
    <div className="dashboardContainer">
      <Row className="bg-white py-2 mb-2 justify-content-end dashboardContainer__dashboard">
        <Col
          sm={1.5}
          md={1.5}
          lg={1.5}
          className="dashboardContainer__dashboard__buttonContainer"
        >
          <Button
            variant="danger"
            className="dashboardContainer__dashboard__buttonContainer__button"
            onClick={logout}
          >
            Log Out
          </Button>
        </Col>
      </Row>
      <Row className="bg-white">
        <Users />
        <Messages />
      </Row>
    </div>
  );
};

export default Dashboard;
