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
                    <div id="header" className="row border rounded-pill bg-dark text-light">
                        <nav className="col-auto row align-items-center">
                                {this.Auth.getConfirm().user_name} 
                            <Link className="btn btn-sm btn-success pull-right" to='/'>خانه</Link>
                            
                                <button id="logout" className="col-auto btn btn-sm btn-danger pull-right" onClick={this.handleLogout}>خروج</button>
                                <Link className="btn btn-sm btn-warning pull-right" to='/settings'>تنظیمات</Link>
                        </nav>
                    </div>
                </div>
            </header>
        );
    }
}

export default withRouter(Header);