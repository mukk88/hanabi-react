import * as React from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { Auth } from './Login/Auth';
import { Login } from './Login/Login';
import { Callback } from './Login/Callback';
import { connect, onOpen, onClose } from './Socket';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Header } from './Header/Header';

import { Home } from './Home/Home';

interface IAppState {
  connected: boolean;
}

const auth = new Auth();

class App extends React.Component<{}, IAppState> {

  constructor() {
    super();
    this.state = {
      connected: false,
    };
    // connect('http://localhost:5050');
    connect('http://13.229.118.122:5050');
    onOpen(() => this.setState({
      connected: true
    }));
    onClose(() => this.setState({
      connected: false
    }));
  }

  render() {
    return (
      <MuiThemeProvider>
        <BrowserRouter>
          <div>
            <Switch>
              <Route
                exact={true}
                path="/callback"
                render={() => {
                  auth.handleAuthentication();
                  return <div />;
                }}
              />
              <Route
                exact={true}
                path="/login"
                render={() => {
                  return <div />;
                }}
              />
              <Route
                path="/"
                render={() => {
                  return (
                    <Header
                      auth={auth}
                      connected={this.state.connected}
                    />
                  );
                }}
              />
            </Switch>
            <Switch>
              <Route
                path="/login"
                exact={true}
                render={() => <Login auth={auth}/>}
              />
              <Route
                path="/callback"
                exact={true}
                render={() => <Callback />}
              />
              <ProtectedRoute
                path="/"
                auth={auth}
                component={Home}
              />
            </Switch>
          </div>
        </BrowserRouter>

      </MuiThemeProvider>

    );
  }
}

export default App;
