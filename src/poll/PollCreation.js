import React from 'react';
import DateTimePicker from 'react-datetime-picker';
import API from '../common/API';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class PollCreation extends React.Component {
    constructor(props) {
        super(props);
        const date = new Date()
        this.state = {
            participants: ["sajadbishop@gmail.com"],
            slots: [{from: date, to: new Date(date.getTime() + 1000*3600)}],
            title: "جلسون",
            user: "1"
        }
    }

    componentDidMount() {
        document.title = "رای‌گیری جدید";
    }

    makePoll = () => {
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
        const path = `meetings?userId=${this.state.user}`
        const headers = {
            'Content-Type': 'application/json'
        }
        API.post(path, data, {
            headers
        }).then(res => {
            if (res.status === 200) {
                this.props.history.push(`/polls/${res.data.id}/vote`);
            }
        }).catch(err => {
            this.notifyError(err.response.data.message)
            console.log(err.response)
        });
    }

    notifyError = (message) => toast.error(message);

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
            <SlotItem 
                key={index}
                index={index} 
                slot={s}
                onChangeSlot = {this.changeSlot}
                onRemoveSlot = {this.removeSlot}
                />
            )

        return (
            <div>
                <ToastContainer />
                <h2>رای‌گیری جدید</h2>
                <div>
                    <h4>عنوان رای‌گیری</h4>
                    <input 
                        type="text" placeholder="عنوان رای‌گیری"
                        value={this.state.title} onChange={this.handleTitleChange}
                    />
                </div>
                <div>
                    <h4>شرکت کنندگان</h4>
                    <button onClick={this.makeNewParticipant}>+</button>
                    <ul>
                        {participants}
                    </ul>
                </div>
                <div>
                    <h4>زمان‌های پیشنهادی</h4>
                    <button onClick={this.makeNewSlot}>+</button>
                    <ul>
                        {slots}
                    </ul>
                </div>
                <button onClick={this.makePoll}>ایجاد</button>
            </div>
        )
    }
}

function ParticipantItem(props) {
    return (
        <li key={props.index} >
            <input 
                    type="text" placeholder="شرکت کننده جدید"
                    value={props.email} onChange={(e) => props.onChangeParticipant(props.index, e)}
                />
            <button onClick={(e) => props.onRemoveParticipant(props.index, e)}>-</button>
        </li>
    )
} 

function SlotItem(props) {
    return (
        <li key={props.index} >
            <div>
                from
                <DateTimePicker
                    onChange={(date) => props.onChangeSlot(props.index, true, date)}
                    value={props.slot.from}
                    />
                to
                <DateTimePicker
                    onChange={(date) => props.onChangeSlot(props.index, false, date)}
                    value={props.slot.to}
                    />
            </div>
            <button onClick={(e) => props.onRemoveSlot(props.index, e)}>حذف بازه</button>
        </li>
    )
} 