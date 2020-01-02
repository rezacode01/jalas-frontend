import React from 'react';
import RequestUtil from '../common/Util';
    
export default class Panel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        panel: null
    }
  }

  componentDidMount() {
    document.title = "پنل";
    console.log(this.props.confirm)
    RequestUtil.get('admin/general').then(res => {
        if (res.status === 200) {
            console.log(res.data)
            this.setState({panel: res.data})
        }
    }).catch(err => {
        if (err.response && err.response.status > 400) {
            this.props.history.replace('/401')
        }
        console.log(err)
    })
}

  render() {
    const panel = this.state.panel;
    if (!panel) return "";
    return (
      <div>
       <h1 className="text-right">پنل مدیریت</h1>
        <table className="table table-striped table-dark">
          <tbody>
            <tr>
              <th>تعداد رزروها</th><th>لغوشده‌ها</th><th>تغییریافته‌ها</th><th>میانگین زمان پاسخ</th>
            </tr>
            <tr>
              <td>{panel["Reserved rooms"]}</td><td>{panel["Cancelled meetings"]}</td><td>
                {panel["Changed meetings"]}</td><td>{panel["Average response time"]}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}