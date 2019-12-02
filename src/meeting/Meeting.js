import React from 'react';
import RequestUtil from '../common/Util';
import SlotSelection from './SlotSelection';
import RoomSelection from './RoomSelection';
import Status from './Status';

export default class Meeting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            meeting: null,
            stage: null
        }
    }

    componentDidMount() {
        document.title = "جلس";
        this.fetchMeeting();
    }

    changeStage = (stage) => {
        this.fetchMeeting()
    }

    fetchMeeting() {
        const meetingID = this.props.match.params.meetingID;
        RequestUtil.get(`/meetings/${meetingID}`)
            .then(res => {
                console.log(res.data);
                if (res.status === 200) {
                    this.setState({ ...this.state,
                        meeting: res.data
                    });
                }
            }).catch(err => {
                console.log(err);
            });
    }

    render() {
        const meeting = this.state.meeting;
        if (!meeting) {
            return <div>صبرکنید</div>
        }
        console.log(meeting)

        let display = <SlotSelection 
                        meeting={meeting} 
                        onChangeStage={this.changeStage} />

        if (meeting.state === "TIME_SUBMITTED") {
            display = <RoomSelection 
                        meeting={meeting} 
                        onChangeStage={this.changeStage} />
        }
        else if (meeting.state === "ROOM_SUBMITTED" || meeting.state === "RESERVED") {
            display = <Status 
                        meeting={meeting} 
                        onChangeStage={this.changeStage} />
        }

        return (
            <div> {display} </div>
        );
    }
}