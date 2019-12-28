import React from 'react';
import RequestUtil from '../common/Util';
    
export default class Panel extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    document.title = "پنل";
    console.log(this.props.confirm)
    RequestUtil.get('Admin/general').then(res => {
        if (res.status === 200) {
            console.log(res.data)
        }
    }).catch(err => {
        console.log(err)
    })
}


  render() {

    return (
      <div>
        {meeting.state === "ROOM_SUBMITTED" &&
          <div>
            <h1>درخواست رزرو شما ثبت شده است</h1>
            <button onClick={this.handleCancel}>لغو درخواست</button>
          </div>
        }
        <table className="table table-striped table-dark">
          <tbody>
            <tr>
              <th>عنوان جلسه</th><th>شناسه</th><th>اتاق</th><th>زمان</th><th>وضعیت</th>
            </tr>
            <tr>
              <td></td><td></td><td></td><td></td><td></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }