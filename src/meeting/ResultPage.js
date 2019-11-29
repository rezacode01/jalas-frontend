import React from 'react';
import './ProjectPage.css';
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
    const params = this.props.match.params;
    const meetingID = params.meetingID;
    const userID = params.userID;
    const slotID = params.slotID;
    const roomID = params.roomID;
    const path = 'users/' + userID + '/meeting/' + meetingID + '/slots/' + slotID + '/rooms/' + roomID;
    RequestUtil.post(path)
    .then(res => {
      console.log(res.data);
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
    let message = "درخواست شما ثبت گردید." 
    if (meeting.state === "submittedRoom") {
        message = "درخواست شما با موفقیت تایید گردید." 
    }

    return (
      <h1>
         {message}
      </h1>
    );
  }
}


