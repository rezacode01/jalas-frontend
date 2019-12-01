import React from 'react';
import RequestUtil from '../common/Util';

export default class SlotPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      meeting: {slots:[]},
      redirect: false,
    }
  }

  componentDidMount() {
    document.title = "جلس";
    const meetingID = this.props.match.params.meetingID;
    // const userID = this.props.match.params.userID;
    const path = '/meetings/' + meetingID;
    RequestUtil.get(path).then(res => {
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

  render() {
    // const meeting = this.state.meeting;
    const meetingID = this.props.match.params.meetingID;
    const path = '/meetings/' + meetingID;

    return (
      <div className="job-item-title-container">
        <h3>{this.state.meeting.title}</h3>
        <table border="1">
          <tbody>
            <tr>
              <th>شروع</th><th>اتمام</th><th>موافق</th><th>مخالف</th><th>انتخاب</th>
            </tr>
            { this.state.meeting.slots.map(slot => <SlotItem key={slot.id} slot={slot} path={path} /> )}
          </tbody>
        </table>
      </div>
    );
  }
}

function SlotItem(props) {
  let slot = props.slot;
  const roomSelectionPath = props.path + '/slots/' + slot.id;
  return (
      <tr>
        <td>{slot.from}</td>
        <td>{slot.to}</td>
        <td>{slot.agreeCount}</td><td>{slot.disAgreeCount}</td>
        <td><a href={roomSelectionPath}>انتخاب</a></td>
      </tr>
  );
}


