import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Meeting from './meeting/Meeting.js';
import PollCreation from './poll/PollCreation.js';
import Vote from './poll/Vote.js';

class App extends Component {

  render() {
    return (
        <Router>
          <div>
            <Switch>
              <Route exact path="/meetings/:meetingID" component={Meeting} />
              <Route exact path="/polls/new" component={PollCreation} />
              <Route exact path="/polls/:pollID/vote" component={Vote} />
            </Switch>
          </div>
        </Router>
    );
  }
}

export default App;
