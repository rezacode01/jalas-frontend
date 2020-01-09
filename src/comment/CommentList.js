import React, { Component } from "react";
import Comment from "./Comment";
import { render } from "react-dom";
import RequestUtil from "../common/Util";


export default class CommentList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      comments: props.comments,
      poll: props.poll
    }
  }

  deleteComment = (comment) => {
    const data = null;
    const path = `meetings/${this.state.poll}/comments/${this.comment.cid}`
    RequestUtil.delete(path, data).then(res => {
      console.log(res)
      if (res.status === 200) {
        console.log(res)
        this.setState({
          comments: ""
        });
      }
    }).catch(err => {
        console.log(err)
      this.setState({
        error: "خطایی رخ داد",
        loading: false
      });
    });
  }
  
  addComment = (comment) => {
    this.setState({
      loading: false,
      comments: [comment, ...this.state.comments]
    });
  }

  render() { 
    const comments = this.state.comments.sort((a, b) => {
      return a.date > b.date
    })

    if (comments.length === 0) return null;  

    return (
      <div>
        <h5 className="text-muted mb-2">
          {!comments[0].replyTo ? "نظر" :  "پاسخ"} {" "}
          <span className="badge badge-success">{comments.length}</span>
        </h5>

        {comments.length === 0 && !this.props.loading ? (
          <div className="alert text-center alert-info">
            اولین نظردهنده باشید
          </div>
        ) : null}

        {comments.map((comment) => {
          return (<Comment key={comment.cid} comment={comment} />);
        })}
      </div>
    );
  }
}