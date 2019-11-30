import React from 'react';
import './ProjectPage.css';
import RequestUtil from '../common/Util';
import { Redirect } from 'react-router-dom'
import axiosRetry from 'axios-retry';

export default class RoomPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomList: null
    };
    this.handleChangeSlotClick = this.handleChangeSlotClick.bind(this);
  }

  handleChangeSlotClick() {
    const {meetingID, userID, slotID} = this.props.match.params;
    const meetingPath = '/meeting/' + meetingID;
    const path = meetingPath + '/slots/' + slotID;
    const data =  {status: "pending"};
    RequestUtil.post(path, data)
    .then(res => {
      console.log(res.data);
      if (res.status === 200) {
        return <Redirect to={meetingPath} />
      }
    }).catch(error => {
        console.log(error.response);
    });
  }

  componentDidMount() {
    document.title = "جلس";
    const {meetingID, userID, slotID} = this.props.match.params;
    const path = '/meeting/' + meetingID + '/slots/' + slotID;
    RequestUtil.post(path, null, {
        'axios-retry': {
            retries: 20,
            retryDelay: () => {
                return 1000;
            }
        }
    }).then(res => {
      console.log(res.data);
      if (res.status === 200) {
        const roomList = res.data;
        this.setState({ ...this.state, 
          roomList: roomList
        });
      }
    }).catch(error => {
        console.log(error.response);
    });
  }

  render() {
    let roomList = this.state.roomList;
    const {meetingID, userID, slotID} = this.props.match.params;
    const path = '/meeting/' + meetingID + '/slots/' + slotID;
    if (this.state.roomList && this.state.roomList.length) {
        return (
            <div className="job-item-title-container">
                <h3 className="job-item-title">اتاق مورد نظر خود را انتخاب کنید:</h3>
                <ul className="job-list">
                { roomList.slots.map(room => <RoomListItem room={room} path={path} /> )}
                </ul>
            </div>
            );
    } else {
      return (
        <div>
          <h2>اتاقی در این بازه وجود ندارد</h2>
          <button onClick={this.handleChangeSlotClick}>
              زمان خود را تغییر دهید
          </button>
        </div>
      );
    }
  }
}

function RoomListItem(props) {
    let room = props.room;
    const roomSelectionPath = props.path + '/rooms/' + room.id;
    return (
        <li>
          <span>{room.id}</span>
          <a href={roomSelectionPath}>انتخاب</a>
        </li>
    );
}


