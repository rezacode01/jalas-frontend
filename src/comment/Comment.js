import React, { Component } from "react";
import RequestUtil from "../common/Util";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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

  notifyError = (message) => toast.error(message, 
    {position: toast.POSITION.BOTTOM_CENTER});

  handleEditChange = (e) => {
    this.setState({
      editText: e.target.value
    })
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
      isReplying: false,
      editText: this.state.comment.message
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

  handleCancelEdit = () => {
    this.setState({
      isEditing: false
    })
  }

  handleSubmitReply = () => {
    if (!this.state.replyText.length) {
      this.notifyError("پیام خالی است")
      return
    }
    let comment = this.state.comment
    const data = {
      "message": this.state.replyText,
      "replyTo": comment.cid
    };
    const path = `meetings/${this.props.poll}/comments/`
    RequestUtil.postJson(path, data).then(res => {
      if (res.status === 200) {
        let reply = res.data;
        reply.date = new Date()
        reply.children = []
        this.setState({
          isReplying: false,
          replyText: ""
        })
        this.props.addReply(reply);
      }
    }).catch(err => {
      console.log(err)
      if (err.response.status === 500) {
        this.notifyError("پیام بیش از حد طولانی است")
      }
    });
  }

  handleSubmitEdit = () => {
    let comment = this.state.comment
    const data = {
      "message": this.state.editText,
      "replyTo": comment.replyTo ? comment.replyTo.cid : null
    };
    const path = `meetings/${this.props.poll}/comments/${comment.cid}`
    RequestUtil.put(path, data).then(res => {
      if (res.status === 200) {
        this.setState({
          isEditing: false,
          editText: "",
          comment: {...comment,
            message: this.state.editText
          }
        })
      }
    }).catch(err => {
      console.log(err)
    });
  }

  render() {
    const { user, message, date } = this.state.comment;
    const visitor = this.props.user
    let comment = this.state.comment
    return (
    
      <div className="row media px-3 mb-2">
        <div className="media-body p-1 col-12 shadow-sm rounded bg-light border">
        <a id={comment.cid}>
          <div className="col-12">
            <small className="col-3 float-right text-muted">{date.toLocaleDateString()}</small>
            <h6 className="mt-0 mb-1 text-muted">{user.fullname}</h6>
          </div>
        </a>
        <ToastContainer />
        {comment.replyTo &&
        <a href={"#" + comment.replyTo.cid } >
          <div className="media-body p-2 mb-2 rounded bg-white border" 
            style={{
              'color':'aqua',
              'textDecoration':'none',
              'backgroundColor':'dark',
            }}
          >
            <p className="text-muted">{comment.user.fullname}</p>
            {comment.replyTo.message.length > 50 ? 
            comment.replyTo.message.substring(0, 50) : 
            comment.replyTo.message}
          </div>
        </a>}
         <div className="col-12">{message}</div> 
          <div className="row col-10">
         {(user.username === visitor || this.props.isCreator) &&
              <div className="float-left">
                <button className="btn btn-sm btn-warning"
                  onClick={this.handleEdit}
                >ویرایش</button>
                <button className="btn btn-sm btn-danger"
                  onClick={() => this.props.onDelete(comment)}
                >حذف</button>
              </div>
         }
                  <button className="btn btn-sm btn-success"
                  onClick={this.handleReply}>
                  پاسخ
                  </button>  
            </div>
         {this.state.isEditing &&
         <div>
          <textarea
              onChange={this.handleEditChange}
              value={this.state.editText}
              className="form-control text-right col-12"
              style={{'direction': 'rtl'}}
              name="message"
              rows="5"
            />
            <button onClick={this.handleSubmitEdit}>ویرایش</button>
            <button onClick={this.handleCancelEdit}>لغو</button>
          </div>
         }
         {this.state.isReplying &&
         <div>
          <textarea
              onChange={this.handleReplyChange}
              value={this.state.reply}
              className="form-control text-right col-12"
              style={{'direction': 'rtl'}}
              placeholder="پاسخ شما"
              name="message"
              rows="5"
            />
            <button onClick={this.handleSubmitReply}>ارسال</button>
            <button onClick={this.handleCancelReply}>لغو</button>
          </div>
         }
        </div>
      </div>
    
    );
  }
}