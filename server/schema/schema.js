/*

Schema  defines, API data types and relationship between them.  And Root queries, allowed queries with Graph API

*/


const graphql = require('graphql');
const _ = require('lodash');
const Book = require('./../dbmodel/book');
const Author = require('./../dbmodel/author');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull } = graphql;



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
                //console.log(book);
                //return _.find(authors, { id: book.authorid })
                return Author.findById(book.authorid);
            }
        },
        authorNameOnly: {
            type: GraphQLString,
            resolve(book, args) {
                return new Promise((resolve, reject) => {
                    Author.findById(book.authorid,(err, author)=>{
                       // console.log(author);
                        if (err) 
                            reject(err);
                        else 
                            resolve(author.name);
                    });
                });
                
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
                //return _.filter(books, { authorid: author.id })
                return Book.find({authorid:author.id})
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
                //return _.find(books, { id: args.id });
                return Book.findById(args.id);

            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //code to get required data from DB /other sources
                //return _.find(authors, { id: args.id });
                return Author.findById(args.id);

            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
               //return books;
               return Book.find({});
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                //return authors;
                return Author.find({});
            }
        }
    }
});


//Mutation Queries

const Mutation=new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addAuthor:{
            type:AuthorType,
            args:{
                name:{type:new GraphQLNonNull(GraphQLString)},
                age:{type:new GraphQLNonNull(GraphQLInt)},

            },
            resolve(parent, args){
                let author=new Author({  //mongo db model 
                    name:args.name,
                    age:args.age
                });

                return author.save(); //Save record to DB and return it
            }
        },
        addBook:{
            type:BookType,
            args:{
                name:{type: new GraphQLNonNull(GraphQLString)},
                genre:{type:new GraphQLNonNull(GraphQLString)},
                authorid:{type:new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let book=new Book({
                    name:args.name,
                    genre:args.genre,
                    authorid:args.authorid
                });

                return book.save();

            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation:Mutation
});