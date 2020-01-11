import React from 'react';
import RequestUtil from '../common/Util';
    
export default class Status extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let meeting = this.props.meeting;
    let status = meeting.state === "RESERVED" ? "رزرو شده" : 
                 meeting.state === "CANCELLED" ? "لغو" : "رزرو نشده";
    meeting.selectedSlot = meeting.selectedSlot || 'ندارد'
    meeting.room = meeting.room || 'ندارد'

    return (
      <div>
        <table className="table table-striped table-dark">
          <tbody>
            <tr>
              <th>عنوان جلسه</th><th>شناسه</th><th>اتاق</th><th>زمان</th><th>وضعیت</th>
            </tr>
            <tr>
              <td>{meeting.title}</td><td>{meeting.id}</td><td>{meeting.room}</td><td>{meeting.selectedSlot.from}</td><td>{status}</td>
            </tr>
          </tbody>
        </table>
        {(this.props.user === meeting.creator.username && meeting.state !== "CANCELLED") &&
          <button className="btn btn-danger btn-sm btn-block col-3 mb-3" 
                            onClick={this.props.handleCancel}>
                            لغو</button>
        }
      </div>
    );
  }
}


