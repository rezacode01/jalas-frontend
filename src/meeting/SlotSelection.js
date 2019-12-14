import React from 'react';
import RequestUtil from '../common/Util';

export default class SlotSelection extends React.Component {
  constructor(props) {
    super(props);
    this.handleSelectSlot = this.handleSelectSlot.bind(this)
  }

  handleSelectSlot(id, e) {
    e.preventDefault();
    const meetingID = this.props.meeting.id;
    const meetingPath = '/meetings/' + meetingID; 
    const path = meetingPath + "/slots/" + id;
    RequestUtil.post(path, null)
      .then(res => {
        if (res.status === 200) {
          console.log("Slot posted successfully")
          this.props.onChangeStage('slot')
        }
      }).catch(error => {
          console.log(error);
      });
  }

  render() {
    const meeting = this.props.meeting;
    return (
      <div>
        <h3>انتخاب زمان جلسه</h3>
        <table className="table table-striped">
          <tbody>
            <tr>
              <th>شروع</th><th>اتمام</th><th>موافق</th><th>مخالف</th><th>انتخاب</th>
            </tr>
            { meeting.slots.map(slot => <SlotItem key={slot.id} slot={slot} onSelect={this.handleSelectSlot} /> )}
          </tbody>
        </table>
      </div>
    );
  }
}

function SlotItem(props) {
  let slot = props.slot;
  return (
      <tr>
        <td>{slot.from}</td>
        <td>{slot.to}</td>
        <td>{slot.agreeCount}</td><td>{slot.disAgreeCount}</td>
        <td><button className="badge badge-primary badge-pill"
          onClick={(e) => props.onSelect(slot.id, e)}>انتخاب</button></td>
      </tr>
  );
}


