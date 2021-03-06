import decode from "jwt-decode";
import querystring from 'querystring';
import axios from 'axios';

export default class AuthUtil {

  login = (username, password) => {
    const data = {
        username: username,
        password: password,
        grant_type: 'password'
      }
    const options = {
      method: 'post',
      withCredentials: true,
      auth: {
        username: 'dashboard',
        password: 'YI75MdABASE2RR'
      },
      crossDomain: true,
      headers: { 
          'content-type': 'application/x-www-form-urlencoded'
        },
      data: querystring.stringify(data),
      url: "http://127.0.0.1:8048/oauth/token"
    };
    return axios(options).then(res => {
        console.log(res.data)
        this.setToken(res.data.access_token);
        return Promise.resolve(res);
      }).catch(err => {
        console.log(err)
        return false
      });
  };

  loggedIn = () => {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  };

  isTokenExpired = token => {
    try {
      const decoded = decode(token);
      const expirationTime = decoded.exp
      const now = Date.now()/1000
      console.log(expirationTime, now, expirationTime < now)
      if (expirationTime < now) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log("expired check failed! Line 42: AuthService.js");
      return false;
    }
  };

  setToken = idToken => {
    localStorage.setItem("id_token", idToken);
  };

  getToken = () => {
    return localStorage.getItem("id_token");
  };

  logout = () => {
    localStorage.removeItem("id_token");
  };

  getConfirm = () => {
    // Using jwt-decode npm package to decode the token
    let answer = decode(this.getToken());
    return answer;
  };

  fetch = (url, options) => {
    // performs api calls sending the required authentication headers
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json"
    };
    if (this.loggedIn()) {
      headers["Authorization"] = "Bearer " + this.getToken();
    }

    return fetch(url, {
      headers,
      ...options
    })
      .then(this._checkStatus)
      .then(response => response.json());
  };

  _checkStatus = response => {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      var error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  };
}
