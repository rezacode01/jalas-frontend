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
    this.handleSelectRoom = this.handleSelectRoom.bind(this);
  }

  componentDidMount() {
    document.title = "انتخاب اتاق";
    this.getRoomList()
  }

  getRoomList() {
    const {meetingID} = this.props.match.params;
    const path = `/meetings/${meetingID}/available_rooms`;
    RequestUtil.get(path, {
      'axios-retry': {
          retries: 50,
          retryDelay: () => {
            return 1000;
          }
        }
    }).then(res => {
      console.log("Getting RoomList", res);
      if (res.status === 200) {
        this.setState({ ...this.state, 
          roomList: res.data.availableRooms
        });
      }
    }).catch(error => {
        console.log("error", error.response);
    });
  }

  handleChangeSlotClick() {
    const {meetingID} = this.props.match.params;
    const meetingPath = '/meetings/' + meetingID;
    const data =  {status: "pending"};
    RequestUtil.post(meetingPath, data).then(res => {
      console.log(res.data);
      if (res.status === 200) {
        return <Redirect to={meetingPath} />
      }
    }).catch(error => {
        console.log(error.response);
    });
  }
  
  handleSelectRoom(id, e) {
    e.preventDefault();
    console.log(id, " selected");
    const meetingID = this.props.match.params.meetingID;
    RequestUtil.post(`/meetings/${meetingID}/rooms/${id}`, null).then(res => {
      console.log(res);
      if (res.status === 200) {
        console.log("Posted room id");
        this.props.history.push(`/meetings/${meetingID}/status`);
      }
    }).catch(error => {
        console.log(error);
    });
  }

  render() {
    let roomList = this.state.roomList;
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
                  { roomList.map(room => <RoomListItem key={room} room={room} onSelect={this.handleSelectRoom} /> )}
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
    return (
        <li>
          <div>{room}-<button onClick={(e) => props.onSelect(room, e)}>انتخاب</button></div>
        </li>
    );
}