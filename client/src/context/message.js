import React, { createContext, useReducer, useContext } from 'react';
import produce from 'immer';

const MessageStateContext = createContext();
const MessageDispatchContext = createContext();

const messageReducer = (state, action) => {
  let userIndex, usernameOfUser, reaction, messageIndex, reactionIndex;

  switch (action.type) {
    case 'SET_USERS':
      return produce(state, (draft) => {
        draft.users = action.payload;
      });
    case 'SET_USER_MESSAGES':
      const { username, messages } = action.payload;
      userIndex = state.users.findIndex((user) => user.username === username);

      return produce(state, (draft) => {
        draft.users[userIndex].messages = messages;
      });
    case 'SET_SELECTED_USER':
      return produce(state, (draft) => {
        draft.users.forEach((user) => {
          user.selected = user.username === action.payload;
        });
      });
    case 'ADD_MESSAGE':
      usernameOfUser = action.payload.username;
      const { message } = action.payload;

      userIndex = state.users.findIndex(
        (user) => user.username === usernameOfUser
      );

      return produce(state, (draft) => {
        message.reactions = [];

        draft.users[userIndex].messages.unshift(message);
        draft.users[userIndex].latestMessage = message;
      });
    case 'ADD_REACTION':
      reaction = action.payload.reaction;
      usernameOfUser = reaction.message.to;

      userIndex = state.users.findIndex(
        (user) => user.username === usernameOfUser
      );

      if (userIndex === -1) {
        userIndex = state.users.findIndex(
          (user) => user.username === reaction.message.from
        );
      }

      messageIndex = state.users[userIndex].messages.findIndex(
        (message) => message.uuid === reaction.message.uuid
      );

      reactionIndex = state.users[userIndex].messages[
        messageIndex
      ].reactions.findIndex((r) => r.uuid === reaction.uuid);

      return produce(state, (draft) => {
        if (messageIndex > -1 && reactionIndex > -1) {
          draft.users[userIndex].messages[messageIndex].reactions[
            reactionIndex
          ] = reaction;
        } else if (messageIndex > -1) {
          draft.users[userIndex].messages[messageIndex].reactions.push(
            reaction
          );
        }
      });
    case 'REMOVE_REACTION':
      reaction = action.payload.reaction;
      usernameOfUser = reaction.message.to;

      userIndex = state.users.findIndex(
        (user) => user.username === usernameOfUser
      );

      if (userIndex === -1) {
        userIndex = state.users.findIndex(
          (user) => user.username === reaction.message.from
        );
      }

      messageIndex = state.users[userIndex].messages.findIndex(
        (message) => message.uuid === reaction.message.uuid
      );

      reactionIndex = state.users[userIndex].messages[
        messageIndex
      ].reactions.findIndex((r) => r.uuid === reaction.uuid);

      return produce(state, (draft) => {
        if (messageIndex > -1 && reactionIndex > -1) {
          draft.users[userIndex].messages[messageIndex].reactions.splice(
            reactionIndex,
            1
          );
        }
      });
    default:
      return state;
  }
};

export const MessageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(messageReducer, { users: null });

  return (
    <MessageDispatchContext.Provider value={dispatch}>
      <MessageStateContext.Provider value={state}>
        {children}
      </MessageStateContext.Provider>
    </MessageDispatchContext.Provider>
  );
};

export const useMessageState = () => useContext(MessageStateContext);
export const useMessageDispatch = () => useContext(MessageDispatchContext);
