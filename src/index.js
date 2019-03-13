import Cache from './cache';
import {Storage} from './tokenStorage';
import Connector from './connector';

const STORAGE_KEY = "buidlhub_token";
let inst = null;
class Bot {
  static get instance() {
    if(!inst)  {
      inst = new Bot();
    }
    return inst;
  }

  constructor() {
    this._cache = null;

    [
      'init'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }

  init(props) {
    if(this._cache) {
      return;
    }
    if(!props) {
      throw new Error("Missing init properties");
    }
    if(!props.apiKey) {
      throw new Error("Missing API key in properties");
    }
    let con = new Connector({
      apiKey: props.apiKey,
      baseUrl: props.baseUrl,
      tokenStorage: new Storage({keyPath: STORAGE_KEY})
    });
    this._cache = new Cache({connector: con});
  }

  get cache() {
    if(!this._cache){
      throw new Error("Must first initialize BUIDLBot with apikey");
    }
    return this._cache;
  }
}

export default Bot;
