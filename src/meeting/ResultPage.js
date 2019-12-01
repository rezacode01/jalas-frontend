import React from 'react';
import RequestUtil from '../common/Util';
    

export default class ResultPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      meeting: null
    }
  }

  componentDidMount() {
    document.title = "جلس";
    const {meetingID, roomID} = this.props.match.params;
    const path = '/meetings/' + meetingID + '/rooms/' + roomID;
    RequestUtil.post(path, null).then(res => {
        console.log("post...", res);
        if (res.status === 200) {
            this.setState({ ...this.state, 
                meeting: res.data
            });
        }
    }).catch(error => {
        console.log(error);
    });
  }

  render() {
    let meeting = this.state.meeting;
    console.log("meeting", meeting)
    let message = "صبرکنید"
    if (!meeting) {
        return <div>صبرکنید</div>
    }
    if (meeting.state === "ROOM_SUBMITTED") {
        message = "درخواست شما ثبت شد. منتظر تایید باشید"
    } else if (meeting.state === "RESERVED") {
        message = "درخواست شما با موفقیت تایید گردید." 
    }

    return (
      <h1>
         {message}
      </h1>
    );
  }
}


