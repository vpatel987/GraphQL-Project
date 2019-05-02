const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// allow cross origin requests
app.use(cors());

const uri = 'mongodb+srv://vishwaa:test123@cluster0-dphlz.mongodb.net/test?retryWrites=true';
mongoose.connect(uri, { useNewUrlParser: true });
mongoose.connection.once('open', () => {
  console.log("Connected to the database");
})

// exporting the schema so I can use it in this file
app.use('/graphql', graphqlHTTP({
  // can also write as schema because both the names are the same
  //schema
  schema: schema,
  graphiql: true
}));

app.listen(4000, () => {
  console.log('now listening for requests on port 4000');
})
