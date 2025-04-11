const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://admin:NQTRj8MZl5o88N2o@cluster0.7qkjke1.mongodb.net/FairGadi")
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });


const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
});

const User = mongoose.model('User', userSchema);

module.exports = {
    User
}