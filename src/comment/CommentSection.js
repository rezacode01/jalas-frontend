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
      loading: false,
      newComment: null
    };
    this.addComment = this.addComment.bind(this);
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.fetchComments();
  }

  fetchComments() {
    RequestUtil.get(`meetings/${this.state.poll}/comments`)
    .then(res => {
      let comments = res.data.list
      this.setState({
        comments: comments,
        loading: false
      });
    })
    .catch(err => {
      console.log(err)
      this.setState({ loading: false });
    });
  }

  addComment(comment) {
    this.setState({
      comments: [comment, ...this.state.comments]
    })
  }

  deleteComment = (comment) => {
    const path = `meetings/${this.state.poll}/comments/${comment.cid}`
    RequestUtil.delete(path, null).then(res => {
      if (res.status === 200) {
        let comments = this.state.comments.slice()
        comments = comments.filter(function( obj ) {
          return obj.cid !== comment.cid;
        })
        this.fetchComments()
      }
    }).catch(err => {
      console.log(err)
    });
  }

  render() {
    if (this.state.loading) return "صبرکنید"

    let comments = this.state.comments
    console.log(comments)
    return (
      <div className="container bg-light shadow">
        <div className="row">

          <div className="col-8  pt-3 bg-white text-right">
            <CommentList
              deleteComment={this.deleteComment}
              addReply={this.addComment}
              loading={this.state.loading}
              comments={comments}
              newComment={this.state.newComment}
              poll={this.state.poll}
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
