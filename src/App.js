import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Meeting from './meeting/Meeting.js';
import PollCreation from './poll/PollCreation.js';

class App extends Component {

  render() {
    return (
        <Router>
          <div>
            <Switch>
              <Route exact path="/meetings/:meetingID" component={Meeting} />
              <Route exact path="/poll/new" component={PollCreation} />
            </Switch>
          </div>
        </Router>
    );
  }
}

export default App;
