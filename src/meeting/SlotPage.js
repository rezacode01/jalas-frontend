import React from 'react';
import './ProjectPage.css';
import RequestUtil from '../common/Util';
    

export default class SlotPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      meeting: null,
      redirect: false,
    }
  }

  componentDidMount() {
    document.title = "جلس";
    const meetingID = this.props.match.params.meetingID;
    const userID = this.props.match.params.userID;
    const path = 'users/' + userID + '/meeting/' + meetingID;
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
    const meeting = this.props.meeting;
    const meetingID = this.props.match.params.meetingID;
    const userID = this.props.match.params.userID;
    const path = 'users/' + userID + '/meeting/' + meetingID;

    return (
      <div className="job-item-title-container">
        <h3 className="job-item-title">{meeting.title}</h3>
        <ul className="job-list">
          { meeting.slots.map(slot => <SlotItem slot={slot} path={path} /> )}
        </ul>
      </div>
    );
  }
}

function SlotItem(props) {
  let slot = props.slot;
  const roomSelectionPath = props.path + '/slots/' + slot.id;
  return (
      <li>
        <p>from {slot.from} to {slot.to} with votes: +: {slot.agreement} || -:{slot.disagreement}</p>
        <a href={roomSelectionPath}>انتخاب</a>
      </li>
  );
}


