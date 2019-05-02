const graphql = require("graphql");
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');
const User = require('../models/user');
const Bill = require('../models/bill');

// we are extracting the GraphQLObjectType, GraphQLString from graphql so we
// can use it in this function
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,           // type for id (can be either string or int)
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull      // ensures a non null input parameter
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
        return Author.findById(parent.authorId);
      }
    }
  })
})

const BillType = new GraphQLObjectType({
  name: 'Bill',
  // three fields of a book type
  fields: () =>({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    amount: {type: GraphQLString},
    date: {type: GraphQLString},
    user:{
      type: UserType,
      resolve(parent, args){
        return User.findById(parent.userId);
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
        return Book.find({authorId: parent.id});
      }
    }
  })
})

// we are defining the BookType and set it to a GraphQLObjectType
const UserType = new GraphQLObjectType({
  name: 'User',
  // three fields of a book type
  fields: () =>({
    id: {type: GraphQLID},
    username: {type: GraphQLString},
    password: {type: GraphQLInt},
    bill: {
      type: new GraphQLList(BillType),
      resolve(parent, args){
        // get the list of all the books written by this author
        return Bill.find({userId: parent.id});
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
        // to get the data from the database or any other source
        return Book.findById(args.id);
      }
    },

    bill: {
      type: BillType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args){
        // to get the data from the database or any other source
        return Bill.findById(args.id);
      }
    },

    // to get a specific author from the db
    author: {
      type: AuthorType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args){
        return Author.findById(args.id);
      }
    },

    user: {
      type: UserType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args){
        return User.findById(args.id);
      }
    },

    // to get all the books from the db
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args){
        return Book.find({});
      }
    },

    bills: {
      type: new GraphQLList(BillType),
      resolve(parent, args){
        return Bill.find({});
      }
    },

    // to get all the authors from the db
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args){
        return Author.find({});
      }
    },

    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args){
        return User.find({});
      }
    }
  }
})

// mutation to modify the data
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args){
        let user = new User({
          username: args.username,
          password: args.password
        });
        return user.save();
      }
    },

    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args){
        let author = new Author({
          name: args.name,
          age: args.age
        });
        return author.save();
      }
    },

    addBill: {
      type: BillType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        amount: {type: new GraphQLNonNull(GraphQLInt) },
        date: { type: new GraphQLNonNull(GraphQLString)},
        userId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args){
        let bill = new Bill({
          name: args.name,
          amount: args.amount,
          date: new Date().toISOtring(),
          authorId: args.authorId
        });
        return bill.save();
      }
    },

    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) }
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
