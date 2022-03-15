var {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
} = require("graphql");
const _ = require("lodash");

const books = [
  {
    id: "1",
    name: "js book",
    genre: "dfdf",
    author_id: "1",
  },
  {
    id: "2",
    name: "html book",
    genre: "html book sdetails",
    author_id: "2",
  },
  {
    id: "3",
    name: "typscript book",
    genre: "typscript book is good",
    author_id: "1",
  },
];
const authors = [
  {
    id: "1",
    name: "rashed",
    age: 28,
  },
  {
    id: "2",
    name: "khadija",
    age: 21,
  },
];

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return _.find(authors, { id: parent.author_id });
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    book: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return _.filter(books, { author_id: parent.id });
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: () => ({
    book: {
      type: BookType,
      args: { id: { type: GraphQLString }, name: { type: GraphQLString } },
      resolve(parent, args) {
        if (args.id) {
          return _.find(books, { id: args.id });
        }
        if (args.name) {
          return _.find(books, function (o) {
            return new RegExp(args.name, "i").test(o.name);
          });
        }
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.find(authors, { id: args.id });
      },
    },
  }),
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
