const mongoose = require('mongoose');

const fbRequestSchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    username : String,
    feedback : String
});

module.exports = mongoose.model("fbrequest", fbRequestSchema);