import React, { Component } from "react";
import Comment from "./Comment";
import RequestUtil from "../common/Util";


export default class CommentList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      comments: props.comments,
      poll: props.poll
    }
  }

  componentWillReceiveProps(props) {

    const { comments } = props;
      this.setState({
        comments: comments
      })
  }

  deleteComment = (comment) => {
    console.log(comment)
    const data = {
      message: comment.message,
      replyTo: comment.replyTo ? comment.replyTo.cid : ""
    };
    const path = `meetings/${this.state.poll}/comments/${comment.cid}`
    RequestUtil.delete(path, data).then(res => {
      console.log(res)
      if (res.status === 200) {
        let comments = this.state.comments.slice()
        comments = comments.filter(function( obj ) {
          return obj.cid !== comment.cid;
        })
        this.setState({
          comments: comments
        });
      }
    }).catch(err => {
      console.log(err)
    });
  }
  
  addComment = (comment) => {
    this.setState({
      loading: false,
      comments: [comment, ...this.state.comments]
    });
  }

  render() { 
    let comments = this.state.comments;
    
    comments.forEach(comment => {
      return comment.date = new Date(comment.date)
    })
    comments = this.state.comments.sort((a, b) => {
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
          return (<Comment
                    key={comment.cid} 
                    comment={comment}
                    onDelete={this.deleteComment}
                    poll={this.props.poll}
                     />);
        })}
      </div>
    );
  }
}