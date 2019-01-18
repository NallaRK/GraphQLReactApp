const express = require('express');
const graphqlHTTP= require('express-graphql');
const schema = require('./schema/schema')
const mongoose=require('mongoose');
const cors=require('cors')

const app = express();

//connnect to mlab database
mongoose.connect('mongodb://test:test1234@ds035593.mlab.com:35593/booksdb');
mongoose.connection.once('open',()=>{
    console.log("mLab DB connected");
});

//allow cross origin requests
app.use(cors());
app.use('/graphql',graphqlHTTP({
    schema,
    graphiql:true //interactive interface
}));

app.listen(4000, () => {
 
    console.log("Server started, localhost:4000");

});