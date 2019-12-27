import React from 'react';

import RequestUtil from '../common/Util';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            meetings: null,
            polls: null,
            user: this.props.confirm.user_name
        }
    }

    componentDidMount() {
        document.title = "جلس شما";
        console.log( this.props.confirm)
        this.fetchMeetings()
    }

    fetchMeetings() {
        RequestUtil.get(`/meetings`)
            .then(res => {
                console.log(res.data[0]);
                if (res.status === 200) {
                    this.separate(res.data.list)
                }
            }).catch(err => {
                console.log(err);
            });
    }

    separate(all) {
        this.setState({...this.state,
            meetings: all.filter(all => all.state !== "PENDING"),
            polls: all.filter(all => all.state === "PENDING")
        })
    }

    render() {
        let {meetings, polls, user} = this.state;
        if (!this.state.meetings || !this.state.polls) {
            return <div>صبر کنید</div>
        }

        meetings = meetings.sort((a, b) => {
            return a.creator.username !== user
        })
        polls = polls.sort((a, b) => {
           return  a.creator.username !== user
        })

        console.log(polls)
        // const myMeetings = meetings.filter(m => m.creator === user)
        // const myPolls = polls.filter(p => p.creator === user)
        // const otherMeetings = meetings.filter(m => m.creator !== user)
        // const otherPolls = polls.filter(m => m.creator !== user)

        return (
            <div className="container text-right">
                <h1>جلس</h1>
                <a className="btn btn-primary" href={`polls/new`}>رای‌گیری جدید</a>
                <div className="row">
                    <div className="col-sm-5 text-right">>
                        <MeetingList 
                            title="جلسات شما"
                            meetings={meetings} 
                            user={user}>
                            </MeetingList>
                    </div>
                    <div className="col-sm-5 text-right">>
                        <PollList 
                            polls={polls} 
                            user={user}>
                            </PollList>
                    </div>
                </div>
            </div>
        );
    }
}

function MeetingList(props) {
    let meetings = props.meetings;
    return (
        <div>
            <h2>جلسات</h2>
            <ul className="list-group">
                { meetings.map(meeting => { return <MeetingItem key={meeting.id} meeting={meeting} 
                                                                onSelect={1} 
                                                                isOwn={props.user === meeting.creator.username}
                                                                /> 
                                                                })}
            </ul>
        </div>
    );
  }

  function PollList(props) {
    let meetings = props.polls;
    return (
        <div>
            <h2>نظردهی</h2>
            <ul className="list-group">
                { meetings.map(meeting => { return <PollItem key={meeting.id} 
                                                                poll={meeting} onSelect={1} 
                                                                isOwn={props.user === meeting.creator.username}
                                                                /> 
                                                                })}
            </ul>
        </div>
    );
  }

  function MeetingItem(props) {
      let meeting = props.meeting;
      
      return (
      <li className="list-group-item-primary">
          <div className="card">
            <div className="card-body">
                <h5 className="card-title">{meeting.title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{meeting.creator.username}</h6>
                {props.isOwn && <a className="btn btn-dark" href={`meetings/${meeting.id}`}>وضعیت</a>}
                {meeting.state === "RESERVED" && <h6><span className="label label-default">رزروشده</span></h6>}
            </div>
          </div>
      </li>
      )
  }

  function PollItem(props) {
    let poll = props.poll;
    return (
      <li className="list-group-item-primary">
          <div className="card">
            <div className="card-body">
                <h5 className="card-title">{poll.title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{poll.creator.username}</h6>
                <a className="btn btn-primary" href={`polls/${poll.id}`}>رای</a>
                {props.isOwn && <a className="btn btn-dark" href={`polls/${poll.id}/edit`}>تغییر</a>}
            </div>
          </div>
      </li>
    )
}
