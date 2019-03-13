import axios from 'axios';
import {propChecker} from '../utils/props';

//24-hr token expiration in ms
const TOKEN_EXPIRATION = 86400000;

//up to 10 attempts will be made to send to endpoint
const MAX_TRIES = 10;

//default server
const DEFAULT_URL = "https://buidlhub.com";

const Required = [
  'apiKey',
  'tokenStorage'
]

//endpoint to grab abi keys
const API_ACCESS_URL = "/api/auth/apiAccess/";

/**
  * Actual post functionality that can be used recursively to keep
  * trying. Token will be sent using JWT header Authorization: 'Bearer <token>'
**/
const _axiosDo = ({method, url, payload, token, cb, ctx}) => {
  let headers = null;
  if(token) {
    headers = {'Authorization': ('Bearer ' + token)};
  }
  return axios({
    method: method,
    headers,
    url,
    data: payload
  })
  .then(result=>{
    if(result.data.error) {
      cb(new Error(result.data.error), ctx);
    } else {
      cb(null, ctx, result);
    }
  })
  .catch(e=>{
    if(ctx.tries < MAX_TRIES) {
      setTimeout(()=>{
        _axiosDo({method, url, payload, token, cb, ctx: {
          ...ctx,
          tries: ctx.tries+1
        }});
      }, 500);
    } else {
      console.log("Exceeded max tries to send to API server. Giving up", e.message);
      cb(e, ctx);
    }
  });
}

const isExpired = token => {
  if(!token) {
    return true;
  }
  if(token.retrieveTime && Date.now()-token.retrieveTime > TOKEN_EXPIRATION) {
    return true;
  }
  return false;
}

export default class Connector {
  constructor(props) {
    propChecker(props, Required);
    this.baseUrl = props.baseUrl;
    if(!this.baseUrl) {
      this.baseUrl = DEFAULT_URL;
    }

    this.apiKey = props.apiKey;
    this.tokenStorage = props.tokenStorage;
    this.token = null;

    if(typeof this.tokenStorage.read !== 'function') {
      throw new Error("Invalid tokenStorage provided");
    }
    if(typeof this.tokenStorage.write !== 'function') {
      throw new Error("Invalid tokenStorage provided");
    }
    [
      'post',
      'postNoRetries',
      'get',
      'getNoRetries',
      '_doPost',
      '_doGet',
      '_getToken',
      '_resolveToken'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }

  post(url, payload) {
    let ctx = {
      tries: 0
    };
    return this._doPost(url, payload, ctx);
  }

  postNoRetries(url, payload) {
    let ctx = {
      tries: MAX_TRIES
    };

    return this._doPost(url, payload, ctx);
  }

  _doPost(url, payload, ctx) {
    return new Promise(async (done,err)=>{
      let cb = (e, ctx, r) => {
        if(e) {
          return err(e);
        }
        done(r);
      };
      if(!url.startsWith(this.baseUrl)) {
        let u = this.baseUrl + url;
        url = u;
      }
      console.log("Posting to", url);
      try {
        let token = await this._resolveToken();
          return _axiosDo({
            method: "POST",
            url,
            payload,
            token: token.token,
            cb,
            ctx});

      } catch(e) {
        err(e);
      }
    });
  }

  get(url) {
    let ctx = {
      tries: 0
    }
    return this._doGet(url, ctx);
  }

  getNoRetries(url) {
    let ctx = {
      tries: MAX_TRIES
    }
    return this._doGet(url, ctx);
  }

  _doGet(url, ctx) {
    return new Promise(async (done,err)=>{
      let cb = (e, ctx, r) => {
        if(e) {
          return err(e);
        }
        done(r);
      };
      try {
        if(!url.startsWith(this.baseUrl)) {
          let u = this.baseUrl + url;
          url = u;
        }
        let token = await this._resolveToken();
        return _axiosDo({
                    method: "GET",
                    url,
                    token: token.token,
                    cb,
                    ctx});

      } catch(e) {
        err(e);
      }
    });
  }

  _getToken() {
    let url = this.baseUrl + API_ACCESS_URL + this.apiKey;
    let ctx = {
      tries: MAX_TRIES
    };

    return new Promise(async (done,err)=>{
      let cb = (e, ctx, r) => {
        if(e) {
          return err(e);
        }
        let token = {
          token: r.data.token,
          retrieveTime: Date.now()
        }
        this.tokenStorage.write(token);
        done(token);
      }
      _axiosDo({
        method: "GET",
        url,
        cb,
        ctx
      });
    });
  }

  async _resolveToken() {
    let token = this.token;
    if(!token) {
      token = this.tokenStorage.read();
      if(typeof token === 'string') {
        token = JSON.parse(token);
      }
      if(!token || isExpired(token)) {
        token = await this._getToken();
      }
      this.token = token;
    } else if(isExpired(token)) {
      token = await this._getToken();
      this.token = token;
    }
    return token;
  }
}
