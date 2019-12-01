import React from 'react';
import RequestUtil from '../common/Util';

export default class SlotPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      meeting: {slots:[]},
      redirect: false,
    }
    this.handleSelectSlot = this.handleSelectSlot.bind(this)
  }

  componentDidMount() {
    document.title = "جلس";
    const meetingID = this.props.match.params.meetingID;
    RequestUtil.get(`/meetings/${meetingID}`).then(res => {
      console.log(res.data);
      if (res.status === 200) {
        const meetingInfo = res.data;
        this.setState({ ...this.state,
          meeting: meetingInfo
        });
      }
    }).catch(err => {
        console.log(err);
    });
  }

  handleSelectSlot(id, e) {
    e.preventDefault();
    console.log(id, " selected");
    const meetingID = this.props.match.params.meetingID;
    const meetingPath = '/meetings/' + meetingID; 
    const path = meetingPath + "/slots/" + id;
    RequestUtil.post(path, null).then(res => {
      console.log(res);
      if (res.status === 200) {
        console.log("post done")
        this.props.history.push(meetingPath + '/available_rooms')
      }
    }).catch(error => {
        console.log(error);
    });
  }

  render() {

    return (
      <div className="job-item-title-container">
        <h3>{this.state.meeting.title}</h3>
        <table border="1">
          <tbody>
            <tr>
              <th>شروع</th><th>اتمام</th><th>موافق</th><th>مخالف</th><th>انتخاب</th>
            </tr>
            { this.state.meeting.slots.map(slot => <SlotItem key={slot.id} slot={slot} onSelect={this.handleSelectSlot} /> )}
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
        <td><button onClick={(e) => props.onSelect(slot.id, e)}>انتخاب</button></td>
      </tr>
  );
}


