import React from 'react';
import RequestUtil from '../common/Util';
import { Redirect } from 'react-router-dom';

export default class RoomPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomList: null
    };
    this.handleChangeSlotClick = this.handleChangeSlotClick.bind(this);
  }

  handleChangeSlotClick() {
    const {meetingID, slotID} = this.props.match.params;
    const meetingPath = '/meetings/' + meetingID;
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
    const {meetingID, slotID} = this.props.match.params;
    const path = '/meetings/' + meetingID + '/slots/' + slotID;
    RequestUtil.post(path, null)
    .then(res => {
      console.log(res.data);
      if (res.status === 200) {
        console.log("post done")
        this.getRoomList();
      }
    }).catch(error => {
        console.log(error);
    });
  }

  getRoomList() {
    const {meetingID} = this.props.match.params;
    const path = `/meetings/${meetingID}/available_rooms`;
    RequestUtil.get(path, {
      'axios-retry': {
          retries: 20
      }
    }).then(res => {
      console.log("GETRoomList", res);
      if (res.status === 200) {
        const roomList = res.data.availableRooms;
        this.setState({ ...this.state, 
          roomList: roomList
        });
      }
    }).catch(error => {
        console.log("error", error.response);
    });
  }

  render() {
    let roomList = this.state.roomList;
    const {meetingID, slotID} = this.props.match.params;
    const path = '/meetings/' + meetingID + '/slots/' + slotID;
    if (!this.state.roomList) {
      return <div>
          <h2>...صبرکنید</h2>
        </div>
    }
    else if (this.state.roomList && this.state.roomList.length) {
        return (
            <div className="job-item-title-container">
                <h3 className="job-item-title">اتاق مورد نظر خود را انتخاب کنید:</h3>
                <ul>
                  { roomList.map(room => <RoomListItem key={room} room={room} path={path} /> )}
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
    const roomSelectionPath = props.path + '/rooms/' + room;
    return (
        <li>
          {room}
          <a href={roomSelectionPath}>انتخاب</a>
        </li>
    );
}