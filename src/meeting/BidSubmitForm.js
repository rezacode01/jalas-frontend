import React from 'react';
import './ProjectPage.css';

export default class BidSubmitForm extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(e) {
      e.preventDefault();
      this.props.onBidChange(e.target.value);
    }
  
    handleSubmit(e) {
      e.preventDefault();
      this.props.onBidSubmit(Number(this.props.value));
    }
  
    render() {
      const value = this.props.value;
      return (
        <div>
          <h4>ثبت پیشنهاد</h4>
          <form className="bid-form" onSubmit={this.handleSubmit} >
                <div className="input-wrapper">
                  <input 
                    type="number" placeholder="پیشنهاد خود را وارد کنید"
                    value={value} onChange={this.handleChange}
                  />
                  <span className="bid-label">تومان</span>
                </div>
                <button type="submit" value='value'>ارسال</button>
          </form>
        </div>
      );
    }
  }