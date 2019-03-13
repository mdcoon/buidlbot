import Connector from './Connector';
import {MockStorage} from '../tokenStorage';

describe("Connector", () => {
  it("should reject invalid API key", done=>{
    let conn = new Connector({
      apiKey: "invalid",
      tokenStorage: new MockStorage(),
      baseUrl: "https://buidlhub.com"
    });
    try {
      conn.postNoRetries("/api/cache/graphql", {})
      .then(() => {
        done(new Error("Expected failure of post"));
      })
      .catch(e=>{
        if(e.message.indexOf("Unauthorized") >= 0 || e.message.indexOf("401") > 0) {
          return done();
        }
        done(e);
      });
    } catch (e) {
      if(e.message.indexOf("Unauthorized") < 0) {
        return done(e);
      }
      done();
    }
  });

  it("should store token", done=>{
    let apiKey = "API_KEY";
    let mock = new MockStorage();
    let conn = new Connector({
      apiKey,
      tokenStorage: mock,
      baseUrl: "http://buidlhub.com"
    });
    try {
      conn.postNoRetries("/api/cache/graphql", {
        "query": "\n    query IntrospectionQuery {\n      __schema {\n        queryType { name }\n        mutationType { name }\n        subscriptionType { name }\n        types {\n          ...FullType\n        }\n        directives {\n          name\n          description\n          locations\n          args {\n            ...InputValue\n          }\n        }\n      }\n    }\n\n    fragment FullType on __Type {\n      kind\n      name\n      description\n      fields(includeDeprecated: true) {\n        name\n        description\n        args {\n          ...InputValue\n        }\n        type {\n          ...TypeRef\n        }\n        isDeprecated\n        deprecationReason\n      }\n      inputFields {\n        ...InputValue\n      }\n      interfaces {\n        ...TypeRef\n      }\n      enumValues(includeDeprecated: true) {\n        name\n        description\n        isDeprecated\n        deprecationReason\n      }\n      possibleTypes {\n        ...TypeRef\n      }\n    }\n\n    fragment InputValue on __InputValue {\n      name\n      description\n      type { ...TypeRef }\n      defaultValue\n    }\n\n    fragment TypeRef on __Type {\n      kind\n      name\n      ofType {\n        kind\n        name\n        ofType {\n          kind\n          name\n          ofType {\n            kind\n            name\n            ofType {\n              kind\n              name\n              ofType {\n                kind\n                name\n                ofType {\n                  kind\n                  name\n                  ofType {\n                    kind\n                    name\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  "
      })
      .then((r)=>{
        if(!mock.data) {
          done(new Error("Did not retrieve and store token"));
        }
        done();
      }).catch(e=>{
        done(e);
      })
    } catch (e) {
      done(e);
    }
  })
});
