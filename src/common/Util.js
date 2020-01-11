import API from './API';
import querystring from 'querystring';
import AuthUtil from './AuthUtil';
import axios from 'axios'

const createReactClass = require('create-react-class');

const base = "http://127.0.0.1:8048/" 
const RequestUtil = createReactClass({

  statics: {
    API: () => { 
      return axios.create({
      baseURL: base
    })},

    postJson: function(url, data) {
      let Auth =  new AuthUtil();
        const headers = {
          'Content-Type': 'application/json'
        }
        if (Auth.loggedIn()) {
          headers["Authorization"] = "Bearer " +  Auth.getToken();
      };
      console.log(url)
      const options = {
        method: 'post',
        withCredentials: true,
        crossDomain: true,
        headers: headers,
        data: data,
        url: base + url
      };
      return axios(options)
    },
    delete: function(url, data) {
      let Auth =  new AuthUtil();
      const headers = {
        'Content-Type': 'application/json'
      }
      if (Auth.loggedIn()) {
        headers["Authorization"] = "Bearer " +  Auth.getToken();
      };
      return axios.delete(base + url, {headers, data})
      // return axios.options({
      //   method: 'delete',
      //   withCredentials: true,
      //   crossDomain: true,
      //   url: base + url,
      //   headers: headers,
      //   data: data
      // })
    },
    put: function(url, data) {
      let Auth =  new AuthUtil();
      const headers = {
        'Content-Type': 'application/json'
      }
      if (Auth.loggedIn()) {
        headers["Authorization"] = "Bearer " +  Auth.getToken();
      };
      const options = {
        method: 'put',
        withCredentials: true,
        crossDomain: true,
        headers: headers,
        data: data,
        url: base + url
      };
      return axios(options)
    },
    post: function(url, data) {
      
        let Auth =  new AuthUtil();
        
        const headers = {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
        if (Auth.loggedIn()) {
          headers["Authorization"] = "Bearer " +  Auth.getToken();
        };
        return API.post(url, querystring.stringify(data), { 
            headers
        });
    },
    get: function(url) {
      let Auth =  new AuthUtil();
      const headers = {}
      if (Auth.loggedIn()) {
        headers["Authorization"] = "Bearer " + Auth.getToken();
      };
      return API.get(url, {
        headers: headers
      })
    }
  },
  render() {
      return "";
  },
});

export default RequestUtil;