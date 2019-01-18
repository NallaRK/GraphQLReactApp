/*

Schema  defines, API data types and relationship between them.  And Root queries, allowed queries with Graph API

*/


const graphql = require('graphql');
const _ = require('lodash');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList } = graphql;

//Dummy data - later replaced with DB call
var books = [
    { name: 'Book Name -1', genre: 'Fiction', id: '1', authorid: '1' },
    { name: 'Book Name -2', genre: 'Fantasy', id: '2', authorid: '2' },
    { name: 'Book Name -3', genre: 'Sci-Fi', id: '3', authorid: '3' },
    { name: 'Book Name -11', genre: 'Fiction', id: '1', authorid: '1' },
    { name: 'Book Name -22', genre: 'Fantasy', id: '2', authorid: '2' },
    { name: 'Book Name -222', genre: 'Sci-Fi', id: '3', authorid: '2' }
];

var authors = [

    { name: 'Author Name-1', age: 41, id: '1' },
    { name: 'Author Name-2', age: 42, id: '2' },
    { name: 'Author Name-3', age: 43, id: '3' }


];

//Graph API Object Types  - BookType
const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },

        //Creating Relation between Book & Author
        author: {
            type: AuthorType,
            resolve(book, args) {
                console.log(book);
                return _.find(authors, { id: book.authorid })
            }
        },
        authorNameOnly: {
            type: GraphQLString,
            resolve(book, args) {
                return _.find(authors, { id: book.authorid }).name;
            }
        }

    })
});

//Graph API Object Types  - AuthorType
const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },

        /* Creating Relation between Author and Book */
        books: {
            type: new GraphQLList(BookType),
            resolve(author, args) {
                return _.filter(books, { authorid: author.id })
            }
        }
    })
});







//Queries - how intiallly jump into Graph
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //code to get required data from DB /other sources
                return _.find(books, { id: args.id });

            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //code to get required data from DB /other sources
                return _.find(authors, { id: args.id });

            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return books;
            }
        },
        authors: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return authors;
            }
        }
    }
});


module.exports = new GraphQLSchema({
    query: RootQuery
});