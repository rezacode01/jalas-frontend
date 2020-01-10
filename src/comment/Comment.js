import React, { Component } from "react";
import CommentList from "./CommentList";
import RequestUtil from "../common/Util";


export default class Comment extends Component {
  constructor(props) {
    super(props)
    this.state = {
      comment: props.comment,
      replyText: "",
      editText: "",
      isEditing: false,
      isReplying: false
    }
  }

  handleEditChange = (e) => {
  }

  handleReplyChange = (e) => {
    this.setState({
      replyText: e.target.value
    })
  }

  handleEdit = (e) => {
    e.preventDefault()
    this.setState({
      isEditing: true,
      isReplying: false
    })
  }

  handleReply = (e) => {
    e.preventDefault()
    this.setState({
      isReplying: true,
      isEditing: false
    })
  }

  handleCancelReply = () => {
    this.setState({
      isReplying: false
    })
  }

  handleSubmitReply = () => {
    let comment = this.state.comment
    const data = {
      "message": this.state.replyText,
      "replyTo": comment.cid
    };
    const path = `meetings/${this.props.poll}/comments/`
    RequestUtil.postJson(path, data).then(res => {
      if (res.status === 200) {
        let reply = res.data;
        console.log(reply)
        reply.date = new Date()
        reply.children = []
        this.setState({
          isReplying: false,
          replyText: "",
          comment: {...this.state.comment,
            children: [reply, ...this.state.comment.children]
          }
        })
      }
    }).catch(err => {
      console.log(err)
    });
  }

  render() {
    let comment = this.state.comment;
    const { user, message, date } = this.state.comment;
    return (
      <div className="row media px-3 mb-2">
        <div className="media-body p-1 col-12 shadow-sm rounded bg-light border">
          <div className="col-12">
            <small className="col-3 float-right text-muted">{date.toLocaleDateString()}</small>
            <h6 className="mt-0 mb-1 text-muted">{user.fullname}</h6>
          </div>    
         <div className="col-12">{message}</div> 
         <div className="row">
           <div className="float-left">
              <button className="btn btn-default"
                onClick={this.handleEdit}
              >ویرایش</button>
              <button className="btn btn-default"
                onClick={() => this.props.onDelete(comment)}
              >حذف</button>
           </div>
         <button className="btn btn-success float-right"
          onClick={this.handleReply}
          >پاسخ</button>  
         </div> ‍
         {this.state.isReplying &&
         <div>
          <textarea
              onChange={this.handleReplyChange}
              value={this.state.reply}
              className="form-control text-right col-12"
              style={{'direction': 'rtl'}}
              placeholder="نظر شما"
              name="message"
              rows="5"
            />
            <button onClick={this.handleSubmitReply}>ارسال</button>
            <button onClick={this.handleCancelReply}>لغو</button>
          </div>
         }
         {comment.children.length > 0 &&
          <CommentList comments={comment.children}
                       poll={this.props.poll}   
                           />
         }
        </div>
      </div>
    );
  }
}