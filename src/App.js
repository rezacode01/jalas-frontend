import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './login/Login.js';
import Home from './home/Home.js';
import Meeting from './meeting/Meeting.js';
import PollCreation from './poll/PollCreation.js';
import Vote from './poll/Vote.js';
import withAuth from './common/withAuth';
import EditPoll from './poll/EditPoll';
import ErrorPage from './common/ErrorPage'
import Panel from './Admin/Panel'

class App extends Component {

  render() {
    return (
        <Router>
          <div>
            <Switch>
                <Route exact path="/login" component={Login} />
                <Route exact path="/admin" component={withAuth(Panel)} />
                <Route exact path="/" component={withAuth(Home)} />
                <Route exact path="/meetings/:meetingID" component={withAuth(Meeting)} />
                <Route exact path="/polls/new" component={withAuth(PollCreation)} />
                <Route exact path="/polls/:pollID" component={withAuth(Vote)} />
                <Route exact path="/polls/:pollID/edit" component={withAuth(EditPoll)} />
                <Route exact path="/401" component={ErrorPage} />
            </Switch>
          </div>
        </Router>
    );
  }
}

export default App;
        {/* <dependency>
            <groupId>javax.xml.bind</groupId>
            <artifactId>jaxb-api</artifactId>
            <version>2.3.2</version>
        </dependency>

        <dependency>
            <groupId>org.glassfish.jaxb</groupId>
            <artifactId>jaxb-runtime</artifactId>
        </dependency> */}