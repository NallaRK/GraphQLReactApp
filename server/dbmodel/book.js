const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const bookSchema=new Schema({
    name:String,
    genre:String,
    authorid:String
});


//We are creating a collection/table - Book, using schema bookSchema
module.exports=mongoose.model('Book',bookSchema);

