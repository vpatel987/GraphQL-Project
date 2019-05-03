import React, { Component } from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

//components
import BillList from './components/BillList';
import AddBill from './components/AddBill';

// apollo client setup
const client = new ApolloClient({
  uri:'http://localhost:4000/graphql'
})

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div id="main">
          <h1> Ninja reading List </h1>
          <BillList/>
          <AddBill/>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
