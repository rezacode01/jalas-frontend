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
    this.fetchComments();
  }

  fetchComments() {
    RequestUtil.get(`meetings/${this.state.poll}/comments`)
    .then(res => {
      let comments = res.data.list
      let unflattenedComments = this.unflattenComments(comments)
      this.setState({
        comments: unflattenedComments,
        loading: false
      });
    })
    .catch(err => {
      console.log(err)
      this.setState({ loading: false });
    });
  }

  unflattenComments(arr) {
    var tree = [],
        mappedArr = {},
        arrElem,
        mappedElem;
    for(var i = 0, len = arr.length; i < len; i++) {
      arrElem = arr[i];
      mappedArr[arrElem.cid] = arrElem;
      mappedArr[arrElem.cid]['children'] = [];
    }
    console.log(mappedArr)
    for (var id in mappedArr) {
      mappedElem = mappedArr[id];
      if (mappedElem.replyTo) {
        console.log("ok")
        mappedArr[mappedElem['replyTo'].cid]['children'].push(mappedElem);
      } else {
        tree.push(mappedElem);
      }
    }
    return tree;
  } 

  addComment(comment) {
    this.setState({
      loading: false,
      comments: [comment, ...this.state.comments]
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
              loading={this.state.loading}
              comments={comments}
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
