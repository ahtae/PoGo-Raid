import React from 'react';
import { Col } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { useMessageDispatch, useMessageState } from '../../context/message';
import GET_USERS from '../../graphql/queries/getUsers';
import User from './user/User';

const Users = () => {
  const { users } = useMessageState();
  const dispatch = useMessageDispatch();

  const selectedUser = users?.find((user) => user.selected === true)?.username;
  const { loading } = useQuery(GET_USERS, {
    onCompleted: (data) =>
      dispatch({
        type: 'SET_USERS',
        payload: data.getUsers,
      }),
    onError: (err) => console.log(err),
  });

  let allUsers;

  if (loading) {
    return <p>Loading...</p>;
  } else if (!users) {
    return <p>No users have joined yet!</p>;
  } else {
    allUsers = users.map((user) => {
      const selected = selectedUser === user.username;

      return <User selected={selected} key={user.username} user={user} />;
    });
  }

  return (
    <Col xs={2} md={4} className="p-0 bg-secondary usersContainer">
      {allUsers}
    </Col>
  );
};

export default Users;
