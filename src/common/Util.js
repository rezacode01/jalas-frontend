import API from './API';
import querystring from 'querystring';
import AuthUtil from './AuthUtil';

const createReactClass = require('create-react-class');

const RequestUtil = createReactClass({
  
  statics: {
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