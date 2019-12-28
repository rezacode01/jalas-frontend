import React from 'react';
import DateTimePicker from 'react-datetime-picker';
import API from '../common/API';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RequestUtil from '../common/Util';
import SlotAddItem from './SlotAddItem'

export default class PollCreation extends React.Component {
    constructor(props) {
        super(props);
        const date = new Date((new Date).getTime() + 24*1000*3600)
        this.state = {
            participants: [],
            slots: [{from: date, to: new Date(date.getTime() + 1000*3600)}],
            title: "جلسون",
            pending: false,
        }
    }

    componentDidMount() {
        document.title = "رای‌گیری جدید";
    }

    makePoll = () => {
        const participants = this.state.participants.filter(p => p !== "")
        if (!this.state.title.length || !participants.length || !this.state.slots) {
            this.notifyError("ورودی‌ها نباید خالی باشند")
            return;
        }
        this.setState({pending: true})
        const data =  {
            title: this.state.title,
            participants: this.state.participants.filter(Boolean), 
            slots: this.state.slots.map(slot => {
                return {
                    from: slot.from.getTime()/1000,
                    to: slot.to.getTime()/1000
                }
            }),
        }
        const path = `meetings`
        RequestUtil.postJson(path, data).then(res => {
            if (res.status === 200) {
                this.setState({pending: false})
                this.props.history.push(`/polls/${res.data.id}`);
            }
        }).catch(err => {
            this.notifyError(err.response.code)
            console.log(err.response)
        });
    }

    notifyError = (message) => toast.error(message, 
     {position: toast.POSITION.BOTTOM_CENTER});

    handleTitleChange = (e) => {
        e.preventDefault();
        this.setState({ ...this.state,
            title: e.target.value
        });
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

    makeNewParticipant = () => {
        this.setState({
            ...this.state,
            participants: [...this.state.participants, ""]
        });
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
        let participants = this.state.participants.map((p, index) =>
            <ParticipantItem 
                key={index}
                index={index} 
                email={p}
                onChangeParticipant = {this.changeParticipant}
                onRemoveParticipant = {this.removeParticipant}
                />
            )
        
        let slots = this.state.slots.map((s, index) =>
            <SlotAddItem 
                key={index}
                index={index} 
                slot={s}
                onChangeSlot = {this.changeSlot}
                onRemoveSlot = {this.removeSlot}
                />
            )

        return (
            <div className="container-fluid my-3 text-right">
                <ToastContainer />
                <h2>رای‌گیری جدید</h2>
                <div className="panel panel-default">
                    <div className="md-form col-xs-4">
                        <input className="md-textarea form-control text-right"
                            type="text" placeholder="عنوان"
                            value={this.state.title} onChange={this.handleTitleChange}
                        />
                    </div>
                </div>
                <div className="card text-center mb-3">
                    <div className="card-header">شرکت‌کنندگان</div>
                    <div className="card-body  bg-dark">
                        <button className="btn btn-sm btn-primary"
                            onClick={this.makeNewParticipant}>+</button>
                        <ul className="list-group">
                            {participants}
                        </ul>
                    </div>
                </div>
                <div className="card text-center">
                    <div className="card-header">زمان‌ها</div>
                    <div className="card-body bg-dark">
                        <button className="btn btn-sm btn-primary" 
                            onClick={this.makeNewSlot}>+</button>
                        <ul className="list-group">
                            {slots}
                        </ul>
                    </div>
                </div>
                <button className={`btn btn-primary btn-block`} onClick={this.makePoll}>
                    <span className={this.state.pending && "spinner-border spinner-border-sm"}></span>
                    ایجاد</button>
            </div>
        )
    }
}

function ParticipantItem(props) {
    return (
        <li key={props.index} className="list-group-item" >
            <input 
                    type="text" placeholder="شرکت کننده جدید"
                    value={props.email} onChange={(e) => props.onChangeParticipant(props.index, e)}
                />
            <button className="btn btn-danger btn-sm" 
                onClick={(e) => props.onRemoveParticipant(props.index, e)}>-</button>
        </li>
    )
} 