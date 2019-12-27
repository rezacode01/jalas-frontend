import React from 'react';
import API from '../common/API';
import RequestUtil from '../common/Util';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class Vote extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            poll: null
        }
    }

    componentDidMount() {
        document.title = "رای";
        this.fetchPoll();
    }

    fetchPoll() {
        const pollID = this.props.match.params.pollID;
        RequestUtil.get(`/meetings/${pollID}`)
            .then(res => {
                console.log(res.data);
                if (res.status === 200) {
                    this.setState({ ...this.state,
                        poll: res.data,
                    });
                }
            }).catch(err => {
                console.log(err);
            });
    }

    arrangeMeeting = () => {
        this.props.history.push(`/meetings/${this.state.poll.id}`);
    }

    handleVote = (id, vote, e) => {
        e.preventDefault();
        const data = {
            vote: vote === 2 ? "DISAGREE" : "AGREE"
        }
        const path = `meetings/${this.state.poll.id}/slots/${id}/vote`;
        RequestUtil.postJson(path, data).then(res => {
            if (res.status === 200) {
                this.fetchPoll()
            }
        }).catch(function(error) {
            console.log(error);
        });
    }

    handleNameChange = (e) => {
        e.preventDefault();
        this.setState({ ...this.state,
            name: e.target.value
        });
    }
    
    render() {
        const poll = this.state.poll;
        if (!poll) {
            return <div>صبرکنید</div>
        }

        return (
            <div className="container">
            ‍    <ToastContainer />
                <h1 className="text-right">{poll.title}</h1>
                <table className="table table-striped">
                <tbody>
                    <tr>
                        <th>شروع</th><th>اتمام</th><th>موافق</th><th>مخالف</th><th>رای</th>
                    </tr>
                    { poll.slots.map(slot => <SlotItem 
                                                key={slot.id} 
                                                slot={slot} 
                                                onVote={this.handleVote} /> 
                                                )}
                </tbody>
                </table>
                <button onClick={this.arrangeMeeting}>ایجاد جلسه مربوطه</button>
            </div>
        );
    }
}

function SlotItem(props) {
    let slot = props.slot;
    return (
        <tr>
            <td>{slot.from}</td>
            <td>{slot.to}</td>
            <td>{slot.agreeCount}</td><td>{slot.disAgreeCount}</td>
            <td>
                <div className="btn-group btn-group-toggle btn-group-sm">
                <button className="btn btn-primary" onClick={(e) => props.onVote(slot.id, 1, e)}>+</button>
                <button className="btn btn-primary btn-dark" onClick={(e) => props.onVote(slot.id, 2, e)}>-</button>
                </div>
            </td>
        </tr>
    );
 }


