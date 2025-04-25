const mongoose = require('mongoose');
const crypto = require('crypto');


  

const userSchema = new mongoose.Schema({
    userId:String,
    username:String,
    email:String,
    password:String,

})

module.exports = mongoose.model('User', userSchema);