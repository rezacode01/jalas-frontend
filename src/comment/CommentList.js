import React from "react";
import Comment from "./Comment";


export default function CommentList(props) {

  let comments = props.comments;
  comments.forEach(comment => {
    return comment.date = new Date(comment.date)
  })
  comments = comments.sort((a, b) => {
    return b.date - a.date
  })

  return (
    <div>
      <h5 className="text-muted mb-2">
        {"نظر "}
        <span className="badge badge-success">{comments.length}</span>
      </h5>

      {comments.length === 0 && !props.loading ? (
        <div className="alert text-center alert-info">
          اولین نظردهنده باشید
        </div>
      ) : null}

      {comments.map((comment) => {
        return (<Comment
                  key={comment.cid} 
                  comment={comment}
                  addReply={props.addReply}
                  onDelete={props.deleteComment}
                  poll={props.poll}
                  user={props.user}
                  isCreator={props.isCreator}
                />);
      })}
    </div>
  );
}