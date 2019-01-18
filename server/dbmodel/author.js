const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const authorSchema=new Schema({
    name:String,
    age:Number,
});

//We are creating a collection/table - Author, using schema authorSchema
module.exports=mongoose.model('Author',authorSchema);