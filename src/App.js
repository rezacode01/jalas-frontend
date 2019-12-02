import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Meeting from './meeting/Meeting.js';

class App extends Component {

  render() {
    return (
        <Router>
          <div>
            <Switch>
              <Route exact path="/meetings/:meetingID" component={Meeting} />
            </Switch>
          </div>
        </Router>
    );
  }
}

export default App;
