import React from 'react';
import RequestUtil from '../common/Util';
    
export default class UserSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        subs: null
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
      const subs = this.state.subs
      subs[notif] = e.target.value === 1
      this.setState({
          subs
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
    console.log(subs)
    if (!subs) return "صبرکنید"
    return (
      <div className="text-right">
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
    <table className="table col-8 table-striped table-dark"
        style={{'margin': 'auto',
                'width': '50% !important'}}
    >
        <tbody>
        <tr>
            <th>{"انتخاب شما"}</th><th className="text-right">{"اطلاع‌رسانی"}</th>
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
    let name = props.name
    if (persian[name]) name = persian[name]
    
    return (
    <tr>
        <td>
            <select className="mdb-select md-form"
                onChange={(e) => props.onChange(props.name, e)}
                defaultValue={props.option ? "1" : "2"}
            >
                <option value="1">فعال</option>
                <option value="2">غیرفعال</option>
            </select>
        </td>
    <td className="text-right">{name}</td>
    </tr>
    );
}


