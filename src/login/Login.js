import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './Login.css';
import AuthUtil from '../common/AuthUtil';
import { toast } from 'react-toastify';

export default class Login extends Component {

    Auth = new AuthUtil();

    constructor () {
        super();
        this.state = {
            username: '',
            password: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        document.title = 'ورود'
    }

    handleChange (e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit (e) {
        e.preventDefault();
        const {username, password} = this.state;
        if (!username || !password) {
            toast("نام کاربری و گذرواژه را وارد کنید", {
                position: toast.POSITION.BOTTOM_CENTER
            });
            return;
        }
        this.Auth.login(this.state.username, this.state.password)
            .then(res => {
                if (res === false) {
                    toast("شکیبا ", {
                        position: toast.POSITION.BOTTOM_CENTER
                    });
                    return;
                }
                this.props.history.replace("/");
            })
            .catch(err => {
                console.log(err);
            });
    }

    componentWillUnmount() {
        if (this.Auth.loggedIn()){
            this.props.history.replace('/');
        }
    }

    render() {
        if (this.Auth.loggedIn()) {
            return <Redirect to="/" />;
        }
        
        return (
            <>
                <div className="login-page">
                    <div className="form">
                        <form className="register-form" onSubmit={this.handleSubmit}>
                            <div className="row">
                                <div className="col-6">
                                    <input name="username" type="text" className="ltr rtl-placeholder" placeholder="نام کاربری"
                                        autoComplete="on"
                                        value={this.state.username}
                                        onChange={this.handleChange}
                                        />
                                </div>
                                <div className="col-6">
                                    <input name="password" type="password" className="ltr rtl-placeholder" placeholder="کلمه عبور" 
                                        autoComplete="on"
                                        value={this.state.password}
                                        onChange={this.handleChange}
                                        />
                                </div>
                            </div>

                            <button className="signup-button">ورود</button>
                            <p className="message">اگه ثبت‌نام نکرده‌اید، باید دستی اینکار را کنید</p>
                        </form>
                    </div>
                </div>
            </>
        );
  }
}
