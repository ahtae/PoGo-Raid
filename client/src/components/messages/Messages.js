import React, { useEffect, Fragment } from 'react';
import { Col } from 'react-bootstrap';
import { useLazyQuery } from '@apollo/client';
import { useMessageDispatch, useMessageState } from '../../context/message';
import Message from './message/Message';
import GET_MESSAGES from '../../graphql/queries/getMessages';
import MessageForm from './MessageForm';

const Messages = () => {
  const { users } = useMessageState();
  const dispatch = useMessageDispatch();
  const selectedUser = users?.find((user) => user.selected === true);
  const messages = selectedUser?.messages;

  const [getMessages, { loading: messagesLoading }] = useLazyQuery(
    GET_MESSAGES,
    {
      onCompleted: (data) => {
        dispatch({
          type: 'SET_USER_MESSAGES',
          payload: {
            username: selectedUser.username,
            messages: data.getMessages,
          },
        });
      },
    }
  );

  useEffect(() => {
    if (selectedUser && !selectedUser.messages) {
      getMessages({ variables: { from: selectedUser.username } });
    }
  }, [selectedUser]);

  let selectedChatMarkup;

  if (!messages && !messagesLoading) {
    selectedChatMarkup = (
      <p className="messagesContainer__messages__message">Select a friend!</p>
    );
  } else if (messagesLoading) {
    selectedChatMarkup = (
      <p className="messagesContainer__messages__message">Loading...</p>
    );
  } else if (messages && messages.length > 0) {
    selectedChatMarkup = messages.map((message, index) => (
      <Fragment key={message.uuid}>
        <Message message={message} />
        {index === messages.length - 1 && (
          <div className="invisible">
            <hr className="m-0" />
          </div>
        )}
      </Fragment>
    ));
  } else if (messages && messages.length === 0) {
    selectedChatMarkup = (
      <p className="messagesContainer__messages__message">
        You are now connected! Send your first message!
      </p>
    );
  }

  return (
    <Col xs={10} md={8} className="p-0 messagesContainer">
      <div className="messages-box d-flex flex-column-reverse p-3 messagesContainer__messages">
        {selectedChatMarkup}
      </div>
      <div className="px-3 py-2">
        {selectedUser && <MessageForm selectedUser={selectedUser} />}
      </div>
    </Col>
  );
};

export default Messages;
