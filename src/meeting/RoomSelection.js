import React from 'react';
import RequestUtil from '../common/Util';

export default class RoomSelection extends React.Component {
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
    const meetingID = this.props.meeting.id;
    const path = `/meetings/${meetingID}/available_rooms`;
    RequestUtil.get(path, {
        'axios-retry': {
            retries: 50,
            retryDelay: () => {
              return 1000;
            }
          }
      }).then(res => {
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
    const meetingID = this.props.meeting.id;
    const data =  {status: 'PENDING'};
    RequestUtil.post(`/meetings/${meetingID}/status`, data)
      .then(res => {
        if (res.status === 200) {
            console.log("Revert successfully");
            this.props.onChangeStage('init')
        }
      }).catch(error => {
          console.log(error.response);
      });
  }
  
  handleSelectRoom(id, e) {
    e.preventDefault();
    const meetingID = this.props.meeting.id;
    RequestUtil.post(`/meetings/${meetingID}/rooms/${id}`, null).then(res => {
      if (res.status === 200) {
        console.log("Room posted successflly");
        this.props.onChangeStage('room')
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
    else if (this.state.roomList.length) {
        return (
            <div className="job-item-title-container">
                <h3 className="job-item-title">اتاق مورد نظر خود را انتخاب کنید:</h3>
                <ul>
                  { roomList.map(room => { return <RoomListItem key={room} room={room} onSelect={this.handleSelectRoom} /> })}
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