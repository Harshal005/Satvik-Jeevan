const mongoose = require('mongoose');
const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/satvikjeevan");

// Define User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  usertype : {
    type : Number,
    default : 0,
  },
  name: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
    // required: true
  },
  likedposts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "like",
  }],
  profileimage : {
    type: String,
  },
  contact: {
    type: Number
  },
  uploadedposts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "post"
  }],
  fullname : {
    type: String
  },
  Gender : {
    type : String
  },
  Expertise : {
    type : String
  },
  Experience : {
    type : Number
  },
  Certificate : {
    type : String
  }
});


userSchema.plugin(plm);

module.exports = mongoose.model('User', userSchema);
