import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuthState } from '../context/auth';

const DynamicRoute = (props) => {
  const { authenticated, guest, component } = props;
  const { user } = useAuthState();

  if (authenticated && !user) {
    return <Redirect to="/login" />;
  } else if (guest && user) {
    return <Redirect to="/dashboard" />;
  } else {
    return <Route component={component} {...props} />;
  }
};

export default DynamicRoute;
