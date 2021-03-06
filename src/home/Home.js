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
            meetings: all.filter(m => m.state !== "POLL" && m.state !== "PENDING"),
            polls: all.filter(m => m.state === "POLL" || m.state === "PENDING")
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

        return (
            <div className="container text-right">
                <h1>جلس</h1>
                <a className="btn btn-primary" href={`polls/new`}>رای‌گیری جدید</a>
                <div className="row">
                    <div className="col-sm-5 text-right">
                        <MeetingList 
                            title="جلسات شما"
                            meetings={meetings} 
                            user={user}>
                            </MeetingList>
                    </div>
                    <div className="col-sm-5 text-right">
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
            <h2>رای‌گیری‌ها</h2>
            <ul className="list-group">
                { meetings.map(meeting => 
                { return <PollItem key={meeting.id} 
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
                <a className="btn btn-dark stretched-link" href={`meetings/${meeting.id}`}>وضعیت</a>
                {meeting.state === "RESERVED" ? <h6><span className="badge badge-success">رزروشده</span></h6> : (
                    meeting.state === "CANCELLED" && <span className="badge badge-warning">لغوشده</span>)
                }
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
                {poll.state !== "POLL" &&
                <span className="badge badge-warning">بسته شده</span>}
                <a className="btn btn-primary stretched-link" href={`polls/${poll.id}`}>
                {props.isOwn ? "جلسه شما" : "شرکت‌کننده"}</a>
                
            </div>
          </div>
      </li>
    )
}
