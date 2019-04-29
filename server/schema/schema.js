const graphql = require("graphql");
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');

// we are extracting the GraphQLObjectType, GraphQLString from graphql so we
// can use it in this function
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList
} = graphql;

// we are defining the BookType and set it to a GraphQLObjectType
const BookType = new GraphQLObjectType({
  name: 'Book',
  // three fields of a book type
  fields: () =>({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    genre: {type: GraphQLString},
    author:{
      type : AuthorType,
      resolve(parent, args){
        //console.log(parent);
        //console.log(args);
        return _.find(authors, { id: parent.authorId})
      }
    }
  })
})

// we are defining the BookType and set it to a GraphQLObjectType
const AuthorType = new GraphQLObjectType({
  name: 'Author',
  // three fields of a book type
  fields: () =>({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    age: {type: GraphQLInt},
    book: {
      type: new GraphQLList(BookType),
      resolve(parent, args){
        // get the list of all the books written by this author
        return _.filter(books, {authorId: parent.id})
      }
    }
  })
})

// we are defining the RootQuery to reach out to the graph of data from the
// front-end. In here, we are defining to access a particular book, particular
// author, all books and all authors
const RootQuery = new GraphQLObjectType({
  name : 'RootQueryType',
  fields: {
    // to get a specific book from the db
    book: {
      type: BookType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args){
        console.log(parent);
        console.log(args);
        // to get the data from the database or any other source
        return _.find(books, {id: args.id})
      }
    },

    // to get a specific author from the db
    author: {
      type: AuthorType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args){
        return _.find(authors, {id: args.id})
      }
    },

    // to get all the books from the db
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args){
        return books
      }
    },

    // to get all the authors from the db
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args){
        return authors
      }
    }
  }
})

// mutation to modify the data
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: GraphQLString },
        age: { type: GraphQLInt }
      },
      resolve(parent, args){
        let author = new Author({
          name: args.name,
          age: args.age
        });
        return author.save();
      }
    },

    addBook: {
      type: BookType,
      args: {
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        authorId: { type: GraphQLID }
      },
      resolve(parent, args){
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId
        });
        return book.save();
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
