import React from "react";
import Comment from "./Comment";

export default function CommentList(props) {
  return (
    <div className="commentList">
      <h5 className="text-muted mb-4">
        <span className="badge badge-success">{props.comments.length}</span>{" "}
        نظرات
      </h5>

      {props.comments.length === 0 && !props.loading ? (
        <div className="alert text-center alert-info">
          اولین نظردهنده باشید
        </div>
      ) : null}

      {props.comments.map((comment, index) => (
        <Comment key={index} comment={comment} />
      ))}
    </div>
  );
}