import React from 'react';
import RequestUtil from '../common/Util';
import CommentSection from '../comment/CommentSection'
import 'react-toastify/dist/ReactToastify.css';

export default class PollEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            poll: null,
            user: this.props.confirm.user_name,
        }
    }

    componentDidMount() {
        document.title = "رای";
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

    editVote = () => {
        this.props.history.push(`/polls/${this.state.poll.id}/edit`);
    }

    arrangeMeeting = () => {
        this.props.history.push(`/meetings/${this.state.poll.id}`);
    }

    endPoll = () => {
        const pollID = this.state.poll.id;
        const params =`status=PENDING`
        RequestUtil.post(`/meetings/${pollID}/status?${params}`)
            .then(res => {
                if (res.status === 200) {
                    this.fetchPoll()
                }
            }).catch(err => {
                console.log(err);
            });
    }

    handleVote = (id, vote, e) => {
        e.preventDefault();
        const data = {
            vote: vote===1 ? "AGREE" : 
                vote ===2 ? "DISAGREE" : 
                "SO_SO"
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
        const isOwn = this.props.confirm.user_name === poll.creator.username

        return (
            <div className="container"> 
                <div className="container">
                    <h1 className="text-right">{poll.title}</h1>
                    <table className="table table-striped">
                    <tbody>
                        <tr>
                            <th>شروع</th><th>اتمام</th><th>موافق</th><th>بینظر</th><th>مخالف</th><th>رای</th>
                        </tr>
                        { poll.slots.map(slot => <SlotItem 
                                                    key={slot.id} 
                                                    slot={slot} 
                                                    onVote={this.handleVote}
                                                    closed={poll.state === "PENDING"} /> 
                                                    )}
                    </tbody>
                    </table>
                    {(isOwn && poll.state === "POLL") &&
                        <button 
                            type="button" 
                            className="btn btn-secondary btn-lg btn-block"
                            onClick={this.editVote}>
                            ویرایش</button>
                    }
                    {(isOwn && poll.state === "POLL") &&
                        <button className="btn btn-primary btn-lg btn-block" 
                            onClick={this.endPoll}>
                            اتمام رای‌گیری</button>
                    }
                    {(isOwn && poll.state === "PENDING") &&
                        <button className="btn btn-primary btn-lg btn-block" 
                            onClick={this.arrangeMeeting}>
                            ایجاد جلسه مربوطه</button>}
                </div>
                
                {poll.state !== "POLL" ? (
                    <div className="alert text-center alert-warning">
                    رای‌گیری تمام‌شده است
                    </div>
                ) : null}
                <div className="card card-border"
                    style={{ marginUp: '3cm' }}
                    >
                    <CommentSection poll={poll.id}
                        user={this.props.confirm.user_name}
                        isCreator={isOwn}
                    />
                </div>
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
            <td>{slot.agreeCount}</td><td>{slot.soSoCount}</td><td>{slot.disAgreeCount}</td>
            <td>
                {!props.closed &&
                <div className="btn-group btn-group-toggle btn-group-sm">
                <button className="btn btn-primary" onClick={(e) => props.onVote(slot.id, 1, e)}>+</button>
                <button className="btn btn-primary btn-warning" onClick={(e) => props.onVote(slot.id, 3, e)}>~</button>
                <button className="btn btn-primary btn-dark" onClick={(e) => props.onVote(slot.id, 2, e)}>-</button>
                </div>}
            </td>
        </tr>
    );
 }

