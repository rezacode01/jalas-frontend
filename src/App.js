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
              <Route path="/users/:userID/meetings/:meetingID" component={SlotPage} />
              <Route path="/users/:userID/meetings/:meetingID/slots/:slotID" component={RoomPage} />
              <Route path="/users/:userID/meetings/:meetingID/slots/:slotID/rooms/:roomID" component={ResultPage} />
            </Switch>
          </div>
        </Router>
    );
  }
}

export default App;
