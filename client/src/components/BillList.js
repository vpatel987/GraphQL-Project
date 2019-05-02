import React, { Component } from 'react';
import { gql } from 'apollo-boost';
import { graphql } from 'react-apollo';

const getBooksQuery = gql`
  {
    books{
      name
      genre
    }
  }
`

class BillList extends Component {
  render() {
    console.log(this.props)
    return (
      <div>
        <ul id="bill-list">
        <li> Book Name </li>
        </ul>
      </div>
    );
  }
}

export default graphql(getBooksQuery)(BillList);
