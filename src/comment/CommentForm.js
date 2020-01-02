import React, { Component } from "react";
import RequestUtil from "../common/Util";

export default class CommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: "",
        poll: this.props.poll,
      comment: {
        name: "",
        message: ""
      }
    };

    // bind context to methods
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  /**
   * Handle form input field changes & update the state
   */
  handleFieldChange = event => {
    const { value, name } = event.target;

    this.setState({
      ...this.state,
      comment: {
        ...this.state.comment,
        [name]: value
      }
    });
  };

  /**
   * Form submit handler
   */
  onSubmit(e) {
    // prevent default form submission
    e.preventDefault();

    if (!this.isFormValid()) {
      this.setState({ error: "پیام خالی است" });
      return;
    }
    let { comment } = this.state;
    // loading status and clear error
    this.setState({ error: "", loading: true });
    const data = {
        "message": JSON.stringify(comment.message),
	      "replyTo": null
    } 
    // persist the comments on server
    RequestUtil.postJson(`meetings/${this.state.poll}/comments`, data)
      .then(res => {
          console.log(res)
        if (res.error) {
          this.setState({ loading: false, error: res.error });
        } else {
          // add time return from api and push comment to parent state
          res.data.date = new Date();
          this.props.addComment(res.data);

          // clear the message box
          this.setState({
            loading: false,
            comment: { ...comment, message: "" }
          });
        }
      })
      .catch(err => {
          console.log(err)
        this.setState({
          error: "خطایی رخ داد",
          loading: false
        });
      });
  }

  isFormValid() {
    return this.state.comment.message !== "";
  }

  renderError() {
    return this.state.error ? (
      <div className="alert alert-danger">{this.state.error}</div>
    ) : null;
  }

  render() {
    return (
      <React.Fragment>
        <form method="post" onSubmit={this.onSubmit}>

          <div className="form-group">
            <textarea
              onChange={this.handleFieldChange}
              value={this.state.comment.message}
              className="form-control text-right"
              style={{'direction': 'rtl'}}
              placeholder="نظر شما"
              name="message"
              rows="5"
            />
          </div>

          {this.renderError()}

          <div className="form-group">
            <button disabled={this.state.loading} className="btn btn-primary">
              Comment &#10148;
            </button>
          </div>
        </form>
      </React.Fragment>
    );
  }
}