import React from 'react';
import { Container } from 'react-bootstrap';
import { Home, Register, Login, Dashboard } from './pages';
import ApolloProvider from './ApolloProvider';
import { BrowserRouter, Switch } from 'react-router-dom';
import { AuthProvider } from './context/auth';
import { MessageProvider } from './context/message';
import { DynamicRoute } from './components';
import './App.scss';

const App = () => {
  return (
    <ApolloProvider>
      <AuthProvider>
        <MessageProvider>
          <BrowserRouter>
            <Container className="pt-5">
              <Switch>
                <DynamicRoute exact path="/" component={Home} />
                <DynamicRoute
                  exact
                  path="/dashboard"
                  component={Dashboard}
                  authenticated
                />
                <DynamicRoute
                  exact
                  path="/register"
                  component={Register}
                  guest
                />
                <DynamicRoute exact path="/login" component={Login} guest />
              </Switch>
            </Container>
          </BrowserRouter>
        </MessageProvider>
      </AuthProvider>
    </ApolloProvider>
  );
};

export default App;
