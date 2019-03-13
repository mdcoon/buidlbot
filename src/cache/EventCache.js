
const URL = "/api/cache/graphql";

class Query {
  constructor(props) {
    this.query = props.query;
    this.connector = props.connector;
    ['exec'].forEach(fn=>this[fn]=this[fn].bind(this));
  }
  exec() {
    return this.connector.post(URL, {query: this.query})
            .then(r=>r.data);
  }
}

export default class EventCache {
  constructor(props) {
    this.connector = props.connector;
    [
      'graphQL'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }

  graphQL(query) {
    return new Query({query, connector: this.connector});
  }
}
