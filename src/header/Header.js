import React, { Component } from 'react';
import AuthUtil from '../common/AuthUtil';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

class Header extends Component {

    Auth = new AuthUtil();

    handleLogout = () => {
        this.Auth.logout();
        this.props.history.replace('/login');
    }
      
    render() {
        return (
            <header>
                <div className="container h-100">
                    <div id="header" className="row align-items-center justify-content-between">
                        <nav className="col-auto row align-items-center">
                                {this.Auth.getConfirm().user_name} <Link className="btn btn-info" to='/'>خانه</Link>
                            
                            <div id="logout" className="col-auto clickable" onClick={this.handleLogout}>
                                <Link to='/login'>خروج</Link>
                            </div>
                        </nav>
                    </div>
                </div>
            </header>
        );
    }
}

export default withRouter(Header);