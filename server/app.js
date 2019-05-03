const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const {buildSchema} = require('graphql');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

const Bill = require('./models/bill');
app.use(bodyParser.json());

// exporting the schema so I can use it in this file
app.use('/graphql', graphqlHTTP({
  // can also write as schema because both the names are the same
  //schema
  schema: buildSchema(`
    type Bill{
      _id: ID!
      name: String!
      amount: Float!
      date: String!
    }

    input BillInp{
      _id: ID!
      name: String!
      amount: Float!
      date: String!
    }

    type rootQuery{
      bills: [String!]!
    }

    type mutation{
      addBill(billInp: BillInp): Bill
    }

    schema{
      query: rootQuery
      mutation: mutation
    }
  `),
  rootValue:{
    bills: () => {
      return Bill.find({});
    },
    addBill: () => {
      const bill = new Bill({
        name: args.billInp.name,
        amount: args.billInp.amount,
        date: new Date(args.billInp.date)
      })
      return bill.save();
    }
  },
  graphiql: true
}));

//const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-dphlz.mongodb.net/test?retryWrites=true`;
const uri = 'mongodb+srv://vishwaa:test123@cluster0-dphlz.mongodb.net/test?retryWrites=true';
mongoose.connect(uri, { useNewUrlParser: true }
).then(() => {
  app.listen(4000, () => {
    console.log('now listening for requests on port 4000');
  })
}).catch(err => {
  console.log(err);
})

// allow cross origin requests
app.use(cors());
