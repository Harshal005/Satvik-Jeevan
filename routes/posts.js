const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    title: String,
    description: String,
    image: String,
    category: String
});

module.exports = mongoose.model("post", postSchema)