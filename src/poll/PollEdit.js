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
            newParticipant: "",
            newSlot: {from: new Date(), to: new Date()},
            error: "",
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
        const slot = this.state.slot
        if (from) slot.from = date
        else slot.to = date
        this.setState({...this.state,
            slot: slot
        })
    }

    handleSubmitParticipant = () => {
        const p = this.state.newParticipant;
        if (!p.length) 
            return;
        const path = `meetings/${this.state.poll.id}/participants/`
        RequestUtil.API.post(path, null, {
            params: { username: this.state.participant }
        }).then(res => {
            if (res.status === 200) {
                this.setState({
                    newParticiapnt: ""
                })
                this.fetchPoll()
            }
        }).catch(err => {
            this.notifyError(err.response.code)
            console.log(err.response)
        })
    }

    handleSubmitSlot = (e) => {
        e.preventDefault()
        const s = this.state.slot;
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

    removeParticipant = (index, e) => {
        e.preventDefault()
        let newPs = this.state.participants.slice()
        newPs.splice(index, 1)
        console.log(newPs)
        this.setState({ ...this.state,
            participants: newPs
        })
    }

    changeParticipant = (index, e) => {
        e.preventDefault()
        const newPs = this.state.participants.slice()
        newPs[index] = e.target.value
        this.setState({ ...this.state,
            participants: newPs
        })
    }

    removeSlot = (index, e) => {
        e.preventDefault()
        let newPs = this.state.slots.slice()
        newPs.splice(index, 1)
        this.setState({...this.state,
            slots: newPs
        })
    }

    changeSlot = (index, from, date) => {
        const newPs = this.state.slots.slice()
        if (from) newPs[index].from = date
        else newPs[index].to = date
        this.setState({...this.state,
            slots: newPs
        })
    }

    makeNewSlot = () => {
        const date = new Date()
        this.setState({...this.state,
            slots: [...this.state.slots, {
                from: date, 
                to: new Date(date.getTime() + 1000*3600)
            }]
        });
    }

    render() {
        const poll = this.state.poll
        console.log(poll)
        if (!poll) return "صبر کنید"
        // let participants = this.state.poll.participants.map((p, index) =>
        //     <ParticipantItem 
        //         key={index}
        //         index={index} 
        //         email={p}
        //         onRemoveParticipant = {this.removeParticipant}
        //         />
        //     )
        
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
                {/* <div className="card text-center mb-3">
                    <div className="card-header">شرکت‌کنندگان</div>
                    <div className="card-body  bg-dark">
                        <button className="btn btn-sm btn-primary"
                            onClick={this.makeNewParticipant}>+</button>
                        <ul className="list-group">
                            {participants}
                        </ul>
                    </div>
                </div> */}
                <div className="card text-center">
                    <div className="card-header">زمان‌ها</div>
                    <div className="card-body bg-white">
                        <button className="btn btn-sm btn-primary" 
                            onClick={this.handleSubmitSlot}>ثبت زمان </button>
                            <div>
                                <div>
                                from
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
                <button className={`btn btn-primary btn-block`} onClick={this.makePoll}>
                    <span className={this.state.pending && "spinner-border spinner-border-sm"}></span>
                    بازگشت</button>
            </div>
        )
    }
}


function SlotItem(props) {
    let slot = props.slot;
    return (
        <li>
            <div className="row text-center">   
          <span className="col-4">{slot.from}</span>
          <span className="col-4">{slot.to}</span>
          <td><button className="badge badge-danger badge-pill"
            onClick={(e) => props.onSelect(slot.id, e)}>حذف</button></td>
            </div>
        </li>
    );
}



function ParticipantItem(props) {
    return (
        <li key={props.index} className="list-group-item" >
            <div className="row">
                <p className="col-5">props.p</p>
                <button className="btn btn-danger btn-sm"
                onClick={(e) => props.onRemoveParticipant(props.index, e)}>-</button>
            </div>
        </li>
    )
} 