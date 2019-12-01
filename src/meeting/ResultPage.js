import React from 'react';
import RequestUtil from '../common/Util';
import { Redirect } from 'react-router-dom';
    

export default class ResultPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      meeting: null
    }
  }

  componentDidMount() {
    document.title = "جلس";
    const {meetingID} = this.props.match.params;
    RequestUtil.get(`/meetings/${meetingID}`).then(res => {
      console.log(res);
      if (res.status === 200) {
        console.log(res.data.state)
        this.setState({ ...this.state,
          meeting: res.data
        });
      }
    }).catch(err => {
        console.log(err);
    });
  }

  render() {
    let meeting = this.state.meeting;
    let message = "صبرکنید"
    if (!meeting) {
        return <div>صبرکنید</div>
    }
    const meetingPath = `/meetings/${meeting.id}`;
    if (meeting.state === "PENDING") {
        return <Redirect to={meetingPath} />
    } else if (meeting.state === "ROOM_SUBMITTED") {
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


