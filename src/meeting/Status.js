import React from 'react';
import RequestUtil from '../common/Util';
    
export default class Status extends React.Component {
  constructor(props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this)
  }

  handleCancel(e) {
    e.preventDefault()
    const path = `/meetings/${this.props.meeting.id}`;
    RequestUtil.post(path + '/status', {status: 'CANCELLED'})
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          console.log("Cancelled successfully")
        }
      }).catch(error => {
          console.log(error);
      });
    this.props.onChangeStage('cancelAttempt');
  }

  render() {
    let meeting = this.props.meeting;
    let status = meeting.state === "RESERVED" ? "رزرو شده" : 
                 meeting.state === "CANCELLED" ? "لغو" : "رزرو نشده";
    meeting.selectedSlot = meeting.selectedSlot || 'ندارد'
    meeting.room = meeting.room || 'ندارد'

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


