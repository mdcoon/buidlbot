# buidlbot
To use this library, you will first need an API key from https://buidlhub.com. Sign up, register at least 1 project and get your key. This will be needed to initialize.

## Installation
`npm install buidlbot`

## Usage
```javascript
   import BUIDLBot from 'buidlbot';
   
   ...
   
   //initialize the client with an api key. Just do this once since there is a 
   //shared singleton created
   BUIDLBot.instance.init({
      apiKey: <API_KEY>
   });
   
   //create a graphQL query. To understand the schema, go to http://buidlhub.com/app/manager/eventcache and use the 
   //GraphiQL playground to compose the query.
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
   let r = await q.exec();
   //results are in r.data
```

## API Key
To get an API key, you must first signup to https://buidlhub.com and create a project. Each project should have at least one contract defined with its ABI. Once created, go to the 'Settings' sidebar menu item in BUIDLManager. It will present the API key at the top of the settings panel.

## GraphQL Schema
The graphQL schema is outlined below. Note that this will likely change as BUIDLHub adds more filtering and other features to its queries.
```graphql
scalar JSON


  input TimeRange {
    """
      The start time in millis or seconds
    """
    start: Int!

    """
      The end time in millis or seconds
    """
    end: Int!
  }

  enum OrderDirection {
    ASC,
    DESC
  }

  input OrderBy {
    """
      The field to sort by
    """
    field: String!

    """
      The direction of the sort
    """
    direction: OrderDirection!
  }

  type Transaction {
    """
      Confirmed block number for the transaction
    """
    blockNumber: Int!

    """
      Time of the confirmation in seconds since epoch
    """
    timestamp: Int!

    """
       Parsed date string for the transaction
    """
    dateTime: String!

    """
       Sender nonce
    """
    nonce: Int

    """
      Index into the block's transaction set
    """
    transactionIndex: Int!

    """
      Status of the transaction. True is success, false is fail
    """
    status: Boolean!

    """
      Transaction sender address
    """
    from: String!

    """
      Transaction destination address
    """
    to: String!

    """
      Allowed gas limit for this transaction
    """
    gasLimit: Int!

    """
      Gas consumed for this transaction
    """
    gasUsed: Int!

    """
      The proposed gas price in wei
    """
    gasPrice: String!

    """
      Hash for the transaction
    """
    hash: String!

    """
       Any eth sent along with the transaction
    """
    value: String!

    """
      The function called as part of the transaction
    """
    function: Function

    """
      LogEvents generated for a successful transaction
    """
    logEvents: [Event!]
  }


  type Function {
    """
      Name of the function. If not decoded, it will be the encoded function signature
    """
    name: String!

    """
       Parameters pased to the function named according to the ABI, if provided
    """
    params: JSON!
  }

  type Event {
    """
      Name of the event according to the ABI, if provided. Otherwise will be the
      encoded event signature
    """
    name: String!

    """
      Any attributes associated with the event defined in the ABI, if provided
    """
    attributes: JSON!
  }

  type QueryResult {
    """
      Set of transaction results according to query parameters
    """
    hits: [Transaction!]!

    """
      Total available results that can be paged through using limit and offset
    """
    total: Int!

    """
      If there was a problem with the query, an error is returned here.
    """
    error: String
  }

  type Query {
    """
      Get transactions from a cache populated from an EventFlow.
    """
    transactions(
      """
        Required ID of the flow used to populate the cache index
      """
      cacheId: String!,

      """
        Optionally limit the number of results returned in the query. Use this for paging
        to limit the number of items per page. Default is 10.
      """
      limit: Int = 10,

      """
        Optionally apply an offset to results. Use this for paging where the
        offset is computed as page*pageSize. Default is 0.
      """
      offset: Int = 0,

      """
        Optional time range to limit the query results. Default and max is 7 days.
      """
      range: TimeRange,

      """
        Optional sort order for the results.
      """
      orderBy: OrderBy,

      """
        Optional filter by the sender's Ethereum address
      """
      from: String,

      """
        Required list of target addresses to filter transaction results.
      """
      to: [String!]!): QueryResult!
  }

  schema {
    query: Query
  }
```

