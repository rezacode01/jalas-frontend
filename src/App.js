import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './login/Login.js';
import Home from './home/Home.js';
import Meeting from './meeting/Meeting.js';
import PollCreation from './poll/PollCreation.js';
import Vote from './poll/Vote.js';
import withAuth from './common/withAuth';
import ErrorPage from './common/ErrorPage'
import Panel from './Admin/Panel'
import PollEdit from './poll/PollEdit.js';
import UserSettings from './user/UserSettings.js';

class App extends Component {

  render() {
    return (
        <Router>
          <div>
            <Switch>
                <Route exact path="/settings" component={withAuth(UserSettings)} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/admin" component={withAuth(Panel)} />
                <Route exact path="/" component={withAuth(Home)} />
                <Route exact path="/meetings/:meetingID" component={withAuth(Meeting)} />
                <Route exact path="/polls/new" component={withAuth(PollCreation)} />
                <Route exact path="/polls/:pollID/edit" component={withAuth(PollEdit)} />
                <Route exact path="/polls/:pollID" component={withAuth(Vote)} />
                <Route exact path="/401" component={ErrorPage} />
                <Route exact path="*" component={ErrorPage} />
            </Switch>
          </div>
        </Router>
    );
  }
}

export default App;