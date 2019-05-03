import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { getAuthorsQuery} from '../queries/queries';
class AddBill extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: '',
      genre: '',
      authorId: ''
    };
  }
  displayAuthors(){
    var data = this.props.data;
    if (data.loading){
      return (<div> Loading Authors... </div>);
    } else {
      return data.authors.map(author => {
        return (<option key={author.id} value={author.id}>{ author.name }</option>)
      });
    }
  }

  submitForm(e){
    // prevents the default beahviour which is nothing
    e.preventDefault();


  }
  render() {
    return (
      <form id="add-book" onSubmit{this.submitForm.bind(this)}>
        <div className="field">
          <label>Book Name: </label>
          <input type="text" onChange={(e) => this.setState({name: e.target.value})}/>
        </div>

        <div className="field">
          <label>Genre: </label>
          <input type="text" onChange={(e) => this.setState({genre: e.target.value})}/>
        </div>

        <div className="field">
          <label> Author </label>
          <select onChange={(e) => this.setState({authorId: e.target.value})}>
            <option>Select Author </option>
            {this.displayAuthors()}
          </select>
        </div>

        <button>+</button>

      </form>
    );
  }
}

export default graphql(getAuthorsQuery)(AddBill);
