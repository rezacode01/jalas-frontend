import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from 'login/Login.js';
import Home from 'home/Home.js';
import {Meeting} from './meeting/Meeting.js';
import PollCreation from './poll/PollCreation.js';
import Vote from './poll/Vote.js';
import withAuth from './common/withAuth';

class App extends Component {

  render() {
    return (
        <Router>
          <div>
            <Switch>
                <Route exact path="/login" component={Login} />
                <Route exact path="/" component={withAuth(Home)} />
                <Route exact path="/meetings/:meetingID" component={withAuth(Meeting)} />
                <Route exact path="/polls/:pollID" component={withAuth(Vote)} />
                <Route exact path="/polls/new" component={withAuth(PollCreation)} />
            </Switch>
          </div>
        </Router>
    );
  }
}

export default App;
