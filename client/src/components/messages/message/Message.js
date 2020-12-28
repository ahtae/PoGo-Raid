import React, { useState, Fragment } from 'react';
import { useAuthState } from '../../../context/auth';
import classNames from 'classnames';
import moment from 'moment';
import { useMessageDispatch } from '../../../context/message';
import { OverlayTrigger, Button, Popover } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import REACT_TO_MESSAGE from '../../../graphql/mutations/reactToMessage';
import UNREACT_TO_MESSAGE from '../../../graphql/mutations/unreactToMessage';

const reactions = ['❤️', '😆', '😯', '😢', '😡', '👍', '👎'];

const Message = ({ message }) => {
  const { user } = useAuthState();
  const sent = message.from === user.username;
  const received = !sent;
  const dispatch = useMessageDispatch();
  const [showPopover, setShowPopover] = useState(false);

  const [reactToMessage] = useMutation(REACT_TO_MESSAGE, {
    onError: (err) => console.log(err),
    onCompleted: (data) => {
      setShowPopover(false);

      dispatch({
        type: 'ADD_REACTION',
        payload: {
          reaction: data.reactToMessage,
          message,
          user,
        },
      });
    },
  });

  const [unreactToMessage] = useMutation(UNREACT_TO_MESSAGE, {
    onError: (err) => console.log(err),
    onCompleted: (data) => {
      setShowPopover(false);

      dispatch({
        type: 'REMOVE_REACTION',
        payload: {
          reaction: data.unreactToMessage,
          message,
          user,
        },
      });
    },
  });

  const react = (reaction) => {
    reactToMessage({ variables: { uuid: message.uuid, content: reaction } });
  };

  const mapOfIcons = {};
  const reactionIcons = [];

  if (message.reactions && message.reactions.length) {
    message.reactions.forEach((reaction) => {
      if (mapOfIcons[reaction.content]) {
        mapOfIcons[reaction.content].quantity++;
      } else {
        mapOfIcons[reaction.content] = { quantity: 1 };
      }

      const reactionIndex = message.reactions.findIndex(
        (r) => r.content === reaction.content
      );

      if (reactionIndex > -1) {
        mapOfIcons[reaction.content].isMyReaction =
          message.reactions[reactionIndex].user.username === user.username;
        mapOfIcons[reaction.content].uuid =
          message.reactions[reactionIndex].uuid;
      }
    });
  }

  if (message.reactions && message.reactions.length) {
    for (let icon in mapOfIcons) {
      const quantity = mapOfIcons[icon].quantity;

      reactionIcons.push({ icon, quantity });
    }
  }

  const unreact = (reaction) => {
    const uuid = mapOfIcons[reaction].uuid;

    unreactToMessage({ variables: { uuid } });
  };

  const reactButton = (
    <OverlayTrigger
      trigger="click"
      placement="top"
      show={showPopover}
      onToggle={setShowPopover}
      transition={false}
      rootClose
      overlay={
        <Popover className="rounded-pill">
          <Popover.Content>
            {reactions.map((reaction) => (
              <Button
                key={reaction}
                variant="link"
                className="react-icon-button"
                style={{
                  backgroundColor:
                    mapOfIcons[reaction] && mapOfIcons[reaction].isMyReaction
                      ? 'lightblue'
                      : 'white',
                  borderRadius: '50%',
                }}
                onClick={() =>
                  mapOfIcons[reaction] && mapOfIcons[reaction].isMyReaction
                    ? unreact(reaction)
                    : react(reaction)
                }
              >
                {reaction}
              </Button>
            ))}
          </Popover.Content>
        </Popover>
      }
    >
      <Button variant="link px-2">
        <i className="far fa-smile" />
      </Button>
    </OverlayTrigger>
  );

  const messageReactions = reactionIcons.length ? (
    <Fragment className="messageContainer__reactionsContainer__reactions">
      {reactionIcons.map((reaction) => (
        <span
          key={`${reaction.icon}-${reaction.quantity}`}
          className="reactionsContainer__reactions__reaction bg-secondary rounded-pill"
        >
          {reaction.icon} {reaction.quantity === 1 ? null : reaction.quantity}
        </span>
      ))}
    </Fragment>
  ) : null;

  return (
    <div
      className={classNames('d-flex my-1 messageContainer', {
        'ml-auto': sent,
        'mr-auto': received,
      })}
      style={{
        justifyContent: sent ? 'flex-end' : 'flex-start',
      }}
    >
      {sent && reactButton}

      <div
        className={classNames('d-flex my-3 messageContainer__message', {
          'ml-auto': sent,
          'mr-auto': received,
        })}
      >
        <div
          className={classNames('py-2 px-3 rounded-pill position-relative', {
            'bg-primary': sent,
            'bg-secondary': received,
          })}
        >
          <p
            className={classNames('d-flex', {
              'ml-auto': sent,
              'mr-auto': received,
            })}
          >
            {message.content}
          </p>
        </div>
        <div className="messageContainer__date">
          {moment(message.createdAt).format('h:mm A')}
        </div>
        <div
          className="messageContainer__reactionsContainer"
          style={{
            justifyContent: sent ? 'flex-end' : 'flex-start',
          }}
        >
          {messageReactions}
        </div>
      </div>

      {received && reactButton}
    </div>
  );
};

export default Message;
