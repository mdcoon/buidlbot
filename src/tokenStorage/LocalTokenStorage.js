import os from 'os';
import fs from 'fs';
import path from 'path';

/**
  * Abstraction that determines the best way to store a JWT token
  * for reuse. If a local file system is available, that will be
  * used. Otherwise, localStorage is checked. If neither exist,
  * token cannot be stored or retrieved.
**/
export default class LocalTokenStorage {
  /**
    * Constructor options requires a 'keyPath' property. This is
    * either going to be the filename assigned to the token file
    * if a file system is available, or the key in localStorage.
    */
  constructor(props) {
    this.keyPath = props.keyPath;
    if(!this.keyPath) {
      throw new Error("Missing keyPath property");
    }
    if(os && typeof os.tmpdir === 'function') {
      let homeDir = os.homedir();
      let keyPart = props.keyPath.replace(/\//g, "_");
      keyPart = keyPart.replace(/\n/g, "");
      keyPart = keyPart.replace(/\s/g, "");
      this.keyPath = path.join(homeDir, '.buidlhub', keyPart);
      let dir = path.join(homeDir, '.buidlhub');
      if(!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
    }
    [
      'read',
      'write'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }

  /**
    * Write the given token to storage. If not a string, it will be
    * converted to string first.
    */
  write(token) {
    if(!token) {
      return;
    }
    if(typeof token !== 'string') {
      token = JSON.stringify(token);
    }
    if(fs && typeof fs.writeFileSync === 'function') {
      fs.writeFileSync(this.keyPath, token);
      return true;
    }
    if(localStorage && typeof localStorage.setItem === 'function'){
      localStorage.setItem(this.keyPath, token);
      return true;
    }
    return false;
  }

  /**
    * Read a previously stored token. A string is returned so if the token
    * is a complex object, it must be parsed after this method.
    */
  read() {
    if(fs && typeof fs.readFileSync === 'function') {
      if(!fs.existsSync(this.keyPath)) {
        return null;
      }
      let buf =  fs.readFileSync(this.keyPath);
      return buf.toString();
    }
    if(localStorage && typeof localStorage.getItem === 'function') {
      return localStorage.getItem(this.keyPath);
    }
    return null;
  }
}
