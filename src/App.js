import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SlotPage from './meeting/SlotPage';
import ResultPage from './meeting/ResultPage';
import RoomPage from './meeting/RoomPage';

class App extends Component {
 
  render() {
    return (
        <Router>
          <div>
            <Switch>
              <Route exact path="/meetings/:meetingID" component={SlotPage} />
              <Route exact path="/meetings/:meetingID/available_rooms" component={RoomPage} />
              <Route exact path="/meetings/:meetingID/status" component={ResultPage} />
            </Switch>
          </div>
        </Router>
    );
  }
}

export default App;
