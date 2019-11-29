import React, { Component } from "react";
import AuthUtil from "./AuthUtil";

/* A higher order component is frequently written as a function that returns a class. */
export default function withAuth(AuthComponent) {
  const Auth = new AuthUtil();

  return class AuthWrapped extends Component {
    state = {
      confirm: null,
      loaded: false
    };

    componentDidMount() {
      if (!Auth.loggedIn()) {
        this.props.history.push("/login");
      } else {
        /* Try to get confirmation message from the Auth helper. */
        try {
          const confirm = Auth.getConfirm();
          console.log("confirmation is:", confirm);
          this.setState({
            confirm: confirm,
            loaded: true
          });
        } catch (err) {
          console.log(err);
          Auth.logout();
          this.props.history.push("/login");
        }
      }
    }

    render() {
      if (this.state.loaded === true) {
        if (this.state.confirm) {
          return (
            /* component that is currently being wrapper(App.js) */
            <AuthComponent
              history={this.props.history}
              match={this.props.match}
              confirm={this.state.confirm}
            />
          );
        } else {
          console.log("not confirmed!");
          return null;
        }
      } else {
        return null;
      }
    }
  };
}
