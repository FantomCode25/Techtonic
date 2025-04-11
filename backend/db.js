const mongoose = require ("mongoose");

mongoose.connect("") 


const userSchema = new mongoose.Schema({
    username: String,
    firstname: String,
    lastname: String,
    password: String,

})


const User = mongoose.model('User', userSchema);

module.exports = {
    User
}