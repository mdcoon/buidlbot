import {Storage} from './';

const KEY = "_testKey";

describe("TokenStorage", ()=>{
  it("should write token data", done=>{
    let storage = new Storage({keyPath: KEY});
    let token = {
      token: "whatever",
      retrieveTime: Date.now()
    };
    storage.write(token);

    let test = storage.read();
    if(typeof test === 'string') {
      test = JSON.parse(test);
    }
    if(test.token !== token.token) {
      done(new Error("Tokens don't match after storage"));
    }
    done();
  })
});
