import React from 'react';
import RequestUtil from '../common/Util';
import { Redirect } from 'react-router-dom';
    

export default class ResultPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      meeting: null
    }
    this.handleCancel = this.handleCancel.bind(this)
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

  handleCancel(e) {
    e.preventDefault()
    const path = `/meetings/${this.state.meeting.id}`;
    RequestUtil.post(path + '/status', {status: 'CANCELLED'}).then(res => {
      console.log(res);
      if (res.status === 200) {
        console.log("post done")
        this.props.history.push(path)
      }
    }).catch(error => {
        console.log(error);
    });
  }

  render() {
    let meeting = this.state.meeting;
    let status = "رزرو شده"

    if (!meeting) {
        return <div>صبرکنید</div>
    }

    const meetingPath = `/meetings/${meeting.id}`;
    if (meeting.state === "PENDING") {
        return <Redirect to={meetingPath} />
    } else if (meeting.state === "ROOM_SUBMITTED") {
        status = "رزرو نشده"
    }

    return (
      <div>
        {meeting.state === "ROOM_SUBMITTED" &&
          <div>
            <h1>درخواست رزرو شما ثبت شده است</h1>
            <button onClick={this.handleCancel}>لغو درخواست</button>
          </div>
        }
        <table border="1">
          <tbody>
            <tr>
              <th>عنوان جلسه</th><th>شناسه</th><th>اتاق</th><th>زمان</th><th>وضعیت</th>
            </tr>
            <tr>
              <td>{meeting.title}</td><td>{meeting.id}</td><td>{meeting.room}</td><td>{meeting.selectedSlot.from}</td><td>{status}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}


