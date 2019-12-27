import React, { Component } from "react";

import CommentList from "./CommentList";
import CommentForm from "./CommentForm";
import RequestUtil from "../common/Util";

export default class CommentSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comments: [],
      poll: this.props.poll,
      loading: false
    };

    this.addComment = this.addComment.bind(this);
  }

  componentDidMount() {
    this.setState({ loading: true });

    // get all the comments
    RequestUtil.get(`meetings/${this.state.poll}/comments`)
      .then(res => {
        this.setState({
          comments: res.data.list,
          loading: false
        });
      })
      .catch(err => {
        this.setState({ loading: false });
      });
  }

  addComment(comment) {
    this.setState({
      loading: false,
      comments: [comment, ...this.state.comments]
    });
  }

  render() {
    if (this.state.loading) return "صبرکنید"
    return (
      <div className="container bg-light shadow">
        <div className="row">

          <div className="col-8  pt-3 bg-white text-right">
            <CommentList
              loading={this.state.loading}
              comments={this.state.comments}
            />
          </div>
          <div className="col-4  pt-3 border-right text-right">
            <h6>نظر خود را اعلام کنید</h6>
            <CommentForm addComment={this.addComment} poll={this.state.poll} />
          </div>
        </div>
      </div>
    );
  }
}
