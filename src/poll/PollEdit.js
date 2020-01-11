import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RequestUtil from '../common/Util';

import DateTimePicker from 'react-datetime-picker';

export default class PollCreation extends React.Component {
    constructor(props) {
        super(props);
        const date = new Date(new Date().getTime() + 24*1000*3600)
        this.state = {
            poll: null,
            newperson: "",
            newSlot: {from: new Date(), to: new Date()},
            error: "",
            username: this.props.confirm.user_name
        }
    }

    componentDidMount() {
        document.title = "ویرایش رای‌گیری";
        this.fetchPoll();
        const date = new Date()
        date.setDate(date.getDate() + 1)
        this.setState({...this.state,
            slot: {from: date, to: new Date(date.getTime() + 1000*3600)}
        })
    }

    fetchPoll() {
        const pollID = this.props.match.params.pollID;
        RequestUtil.get(`/meetings/${pollID}`)
            .then(res => {
                if (res.status === 200) {
                    this.setState({ ...this.state,
                        poll: res.data,
                    });
                }
            }).catch(err => {
                if (err.response && err.response.status === 403) {
                    this.props.history.replace('/401')
                }
                console.log(err);
            });
    }

    notifyError = (message) => toast.error(message, 
     {position: toast.POSITION.BOTTOM_CENTER});

    handleChangeSlot = (from, date) => {
        const slot = this.state.newSlot
        if (from) slot.from = date
        else slot.to = date
        this.setState({...this.state,
            newSlot: slot
        })
    }

    makenewperson = () => {
        const p = this.state.newperson;
        if (!p.length) {
            this.notifyError("ایمیل خالی است")
            return;
        }
        const param = `username=${this.state.newperson}`
        const path = `meetings/${this.state.poll.id}/participation?${param}`
        RequestUtil.post(path, null).then(res => {
            if (res.status === 200) {
                this.setState({
                    newperson: ""
                })
                this.fetchPoll()
            }
        }).catch(err => {
            if (err.response.status === 500) {
                this.notifyError("شرکت کننده وجود دارد")
            }
            console.log(err.response)
        })
    }

    handleSubmitSlot = () => {
        const s = this.state.newSlot;
        if (s.to - s.from < 0) {
            this.notifyError("بازه معتبر نیست")
            return
        }
        this.setState({pending: true})
        const path = `meetings/${this.state.poll.id}/slots/`
        RequestUtil.postJson(path, {
            from: s.from.getTime()/1000,
            to: s.to.getTime()/1000
        }).then(res => {
            if (res.status === 200) {
                this.fetchPoll()
            }
        }).catch(err => {
            this.notifyError(err.response.code)
            console.log(err.response)
        })
    }

    removeParticipant = (p) => {
        const param=`username=${p}`
        const path =`meetings/${this.state.poll.id}/participation?${param}`
        RequestUtil.delete(path, null).then(res => {
            if (res.status === 200) {
                this.fetchPoll()   
            }
        }).catch(err => {
            console.log(err)
        })
    }

    handleChangeParticipant = (e) => {
        e.preventDefault()
        console.log(e.target.value)
        this.setState({...this.state,
            newperson: e.target.value}
        );
    }

    removeSlot = (slot) => {
        const path = `meetings/${this.state.poll.id}/slots/${slot.id}`
        RequestUtil.delete(path, null).then(res => {
          if (res.status === 200) {
              this.fetchPoll()
          }
        }).catch(err => {
          console.log(err)
        });
    }

    return = () => {
        this.props.history.push(`/polls/${this.state.poll.id}`)
    }

    render() {
        console.log(this.state.newperson)
        const poll = this.state.poll
        console.log(poll)
        if (!poll) return "صبر کنید"
        let participants = this.state.poll.participants.map((p, index) =>
            <ParticipantItem 
                isCreator={p.username === poll.creator.username}
                key={p.username}
                index={index} 
                username={p.username}
                onRemoveParticipant = {this.removeParticipant}
                />
            )
        let slots = this.state.poll.slots.map((s, index) =>
            <SlotItem 
                key={index}
                index={index} 
                slot={s}
                onRemoveSlot = {this.removeSlot}
                />
            )

        return (
            <div className="container-fluid my-3 text-right">
                <ToastContainer />
                <div className="card text-center mb-3">
                    <div className="card-header">شرکت‌کنندگان</div>
                    <div className="card-body  bg-dark">
                        <input
                            type="text" placeholder="شرکت کننده جدید"
                            value={this.state.newperson} onChange={this.handleChangeParticipant}
                        />
                        <button className="btn btn-sm btn-primary"
                            onClick={this.makenewperson}>+</button>
                        <ul className="list-group">
                            {participants}
                        </ul>
                    </div>
                </div>
                <div className="card text-center">
                    <div className="card-header">زمان‌ها</div>
                    <div className="card-body bg-white">
                        <button className="btn btn-sm btn-primary" 
                            onClick={this.handleSubmitSlot}>ثبت زمان </button>
                            <div>
                                <div>from
                                <DateTimePicker
                                    onChange={(date) => this.handleChangeSlot(true, date)}
                                    value={this.state.newSlot.from}
                                    />
                                to
                                <DateTimePicker
                                    onChange={(date) => this.handleChangeSlot(false, date)}
                                    value={this.state.newSlot.to}
                                    />
                                
                                </div>
                            </div>
                        <div className="text-center">
                        <ul className="list-group text-center mt-2">
                            {slots}
                        </ul>
                        </div>
                    </div>
                </div>
                <button className={`btn btn-primary btn-block`} onClick={this.return}>
                    بازگشت</button>
            </div>
        )
    }
}


function SlotItem(props) {
    let slot = props.slot;
    return (
        <li>FROM
          <span className="col-4">{slot.from}</span>TO
          <span className="col-4">{slot.to}</span>
            <button className="badge badge-danger badge-pill"
            onClick={() => props.onRemoveSlot(slot)}>حذف</button>
        </li>
    );
}

function ParticipantItem(props) {
    return (
        <li key={props.index} className="list-group-item" >
            <div className="row">
                <p className="col-5">{props.username}</p>
                {props.isCreator ? <span className="badge badge-success">شما</span> :
                <button className="btn btn-danger btn-sm"
                onClick={() => props.onRemoveParticipant(props.username)}>-</button>
                }
            </div>
        </li>
    )
} 