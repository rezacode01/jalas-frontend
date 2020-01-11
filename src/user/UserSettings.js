import React from 'react';
import RequestUtil from '../common/Util';
    
export default class UserSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        subs: ""
    }
  }

  componentDidMount() {
    RequestUtil.get('me/notification-setting').then(res => {
        if (res.status === 200) {
            console.log(res.data)
            this.setState({subs: res.data})
        } 
    }).catch(err => {
        console.log(err)
    })
  }

  changeOptions = (notif, e) => {
      console.log(notif, e.target.value)
      this.setState({
          subs: {...this.state.subs,
              [notif]: e.target.value===1 ? true : false
          }
      })
  }

  submitOptions = () => {
    RequestUtil.put('me/notification-setting', this.state.subs).then(res => {
        if (res.status === 200) {
            this.props.history.push('/')
        }
    }).catch(err => {
        console.log(err)
    })
  }

  render() {
    const subs = this.state.subs
    console.log(this.state.subs)
    if (!subs) return "صبرکنید"
    return (
      <div>
        <h1>ویرایش اطلاع‌رسانی‌ها</h1>
        <div>
            <NotifList 
                subs={this.state.subs}
                onChange={this.changeOptions}
            />
            
        <button className={`btn btn-primary btn-block`} onClick={this.submitOptions}>
                    بروزرسانی</button>
        </div>
      </div>
    );
  }
}

function NotifList(props) {
    const subs = props.subs
    const notifs = Object.keys(subs)
    return (
    <table className="table table-striped table-dark">
        <tbody>
        <tr>
            <th>{"اطلاع‌رسانی"}</th><th>{"انتخاب شما"}</th>
        </tr>
        {notifs.map((n) =>
          <NotifOption name={n} option={subs[n]}
            key={n}
            onChange={props.onChange} 
            />
        )}
        </tbody>
    </table>
    )
}

const persian = {
    'meetingRoomReservation': "رزرو",
    'meetingInvitation': "دعوت",
    'addingSlot': "اضافه‌شدن زمان",
    'removingSlot': "حذف زمان موافق",
    'addingParticipant': "شرکت‌کننده جدید",
    'removingParticipant': "حذف شرکت‌کننده",
    'voting': "رای جدید",
}

function NotifOption(props) {
    console.log(props.option)
    let name = props.name
    if (persian[name]) name = persian[name]
    
    return (
    <tr>
    <td style={{'direction': 'rtl'}}>{name}</td>
        <td>
            <select className="mdb-select md-form colorful-select dropdown-primary"
                onChange={(e) => props.onChange(props.name, e)}
                selected= {props.option === true ? "1" : "2"}
            >
                <option value="1">فعال</option>
                <option value="2">غیرفعال</option>
            </select>
        </td>
    </tr>
    );
}


