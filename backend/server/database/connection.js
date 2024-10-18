

const mongoose = require("mongoose");
   
    // await mongoose.connect('mongodb://invoiceDB:invoicemail8@162.241.149.204:27017/invoiceDB', {

module.exports = ()=>{
    return mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.dt9hl.mongodb.net/${process.env.MONGODB_DATABASENAME_without_space_without_specialchar}?retryWrites=true&w=majority`);
  // return  mongoose.connect('mongodb://invoiceDB:invoicemail8@162.241.149.204:27017/invoiceDB');
}