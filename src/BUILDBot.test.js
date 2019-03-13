import BUIDLBot from './';

describe("BUIDLBot", ()=>{
  it("Should provide cache", done=>{

    BUIDLBot.instance.init({
     apiKey: "APIKEY"
   });
   let q = BUIDLBot.instance.cache.graphQL(`{
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
        }`);
   q.exec()
   .then(r=>{
     done();
   })
   .catch(e=>{
     done(e);
   })

  })
})
