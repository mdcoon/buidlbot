import {MockStorage} from '../tokenStorage';
import Connector from '../connector';
import Cache from './';

describe("EventCache", ()=>{
  it("should retrieve cache data", done=>{
    let mock = new MockStorage();
    let conn = new Connector({
      baseUrl: "http://buidlhub.com",
      apiKey: "APIKEY",
      tokenStorage: mock
    });
    let cache = new Cache({connector: conn});
    let q = `{
      transactions(cacheId:"flow_id", to:["0x2a0c0dbecc7e4d658f48e01e3fa353f44050c208"]) {
        hits {
          from,
          timestamp,
          status,
          function  {
            name
          }
          logEvents {
            name
          }
        }
        total
      }
    }`;
    cache.graphql(q)
    .then(r=>{
      done();
    })
    .catch(e=>done(e));
  });
});
