// import React from 'react';
// import DateTimePicker from 'react-datetime-picker';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import RequestUtil from '../common/Util';
// import axios from 'axios'

// export default class PollCreation extends React.Component {
//     constructor(props) {
//         super(props);
//         const date = new Date()
//         this.state = {
//             poll: null,
//             slots: [],
//             user: this.props.confirm.user_name,
//             pending: false,
//         }
//     }

//     componentDidMount() {
//         this.fetchPoll()
//     }

//     fetchPoll() {
//         const pollID = this.props.match.params.pollID;
//         RequestUtil.get(`/meetings/${pollID}`)
//             .then(res => {
//                 console.log(res.data);
//                 if (res.status === 200) {
//                     this.setState({ ...this.state,
//                         poll: res.data,
//                     });
//                 }
//             }).catch(err => {
//                 console.log(err);
//             });
//     }

//     submitEdition = () => {
//         this.setState({pending: true})
//         const path = `meetings/${this.state.poll.id}/slots/`
//         this.state.slots.map(s => {
//             return RequestUtil.postJson(path, {
//                     from: s.from.getTime()/1000,
//                     to: s.to.getTime()/1000
//             })
//         })
//         axios.all.then(axios.spread((...responses) => {
//             if (responses.every(x => {
//                 return x.status === 200
//             })) {
//                 this.setState({pending: false})
//                 this.props.history.push(`/polls/${this.state.poll.id}`);
//             }
//         })).catch(err => {
//             this.notifyError(err.response.code)
//             console.log(err.response)
//         })
//     }

//     notifyError = (message) => toast.error(message, 
//      {position: toast.POSITION.BOTTOM_CENTER});

//     changeSlot = (index, from, date) => {
//         const newPs = this.state.slots.slice()
//         if (from) newPs[index].from = date
//         else newPs[index].to = date
//         this.setState({...this.state,
//             slots: newPs
//         })
//     }

//     makeNewSlot = () => {
//         const date = new Date()
//         this.setState({...this.state,
//             slots: [...this.state.slots, {
//                 from: date, 
//                 to: new Date(date.getTime() + 1000*3600)
//             }]
//         });
//     }

//     render() {
//         const poll = this.state.poll;
//         if (!poll) {
//             return <div>صبرکنید</div>
//         }
//         let slots = this.state.poll.slots.map((s, index) =>
//         <li>{s.from} to {s.to} </li> 
//         )
//         slots.concat(this.state.slots.map((s, index) =>
//             <SlotItem 
//                 key={index}
//                 index={index} 
//                 slot={s}
//                 removable={true}
//                 onChangeSlot = {this.changeSlot}
//                 onRemoveSlot = {this.removeSlot}
//                 />
//             )
//         )
        

//         return (
//             <div className="container-fluid my-3 text-right">
//                 <ToastContainer />
//                 <h2>{this.state.poll.title}</h2>
//                 <div className="card text-center">
//                     <div className="card-header">زمان‌ها</div>
//                     <div className="card-body bg-dark">
//                         <button className="btn btn-sm btn-primary" 
//                             onClick={this.makeNewSlot}>+</button>
//                         <ul className="list-group">
//                             {slots}
//                         </ul>
//                     </div>
//                 </div>
//                 <button className={`btn btn-primary btn-block`} onClick={this.submitEdition}>
//                     <span className={this.state.pending && "spinner-border spinner-border-sm"}></span>
//                     ایجاد</button>
//             </div>
//         )
//     }
// }

// function SlotItem(props) {
//     return (
//         <li key={props.index} className="list-group-item" >
//             <div>
//                 from
//                 <DateTimePicker
//                     onChange={(date) => props.onChangeSlot(props.index, true, date)}
//                     value={props.slot.from}
//                     />
//                 to
//                 <DateTimePicker
//                     onChange={(date) => props.onChangeSlot(props.index, false, date)}
//                     value={props.slot.to}
//                     />
//             </div>
//             <button className="btn btn-danger btn-sm" 
//                 onClick={(e) => props.onRemoveSlot(props.index, e)}>حذف بازه</button>
//         </li>
//     )
// } 