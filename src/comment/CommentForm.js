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
        message: ""
      }
    };

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
    e.preventDefault();

    if (!this.isFormValid()) {
      this.setState({ error: "پیام خالی است" });
      return;
    }
    let { comment } = this.state;
    
    this.setState({ error: "", loading: true });
    const data = {
        "message": comment.message,
	      "replyTo": null
    } 
    
    RequestUtil.postJson(`meetings/${this.state.poll}/comments`, data)
      .then(res => {
        if (res.error) {
          this.setState({ loading: false, error: res.error });
        } else {
          console.log(res)
          res.data.date = new Date();
          res.data.children = [];
          this.props.addComment(res.data);

          this.setState({
            loading: false,
            comment: { message: "" }
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
              ارسال نظر &#10148;
            </button>
          </div>
        </form>
      </React.Fragment>
    );
  }
}