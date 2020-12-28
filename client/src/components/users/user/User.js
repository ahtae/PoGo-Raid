import React from 'react';
import classNames from 'classnames';
import { Image } from 'react-bootstrap';
import { useMessageDispatch } from '../../../context/message';

const User = ({ selected, user }) => {
  const dispatch = useMessageDispatch();

  const handleSelectUser = () => {
    dispatch({ type: 'SET_SELECTED_USER', payload: user.username });
  };

  return (
    <div
      role="button"
      className={classNames(
        'user-div d-flex justify-content-center justify-content-md-start p-3 userContainer',
        {
          'bg-white': selected,
        }
      )}
      onClick={handleSelectUser}
    >
      <Image
        src={
          user.imageUrl ||
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTY7-RC9JUZLIvBem9xBKX1feFnmigMBUva-A&usqp=CAU'
        }
        className="userContainer__image"
      />
      <div className="d-none d-md-block ml-2">
        <p className="text-success m-0">{user.username}</p>
        <p className="font-weight-light">
          {user.latestMessage
            ? user.latestMessage.content
            : 'You are now connected!'}
        </p>
      </div>
    </div>
  );
};

export default User;
