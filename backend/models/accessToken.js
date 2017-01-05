const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

let tokenSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    token: String,
    user: {
        type: Schema.ObjectId,
        ref: "User"
    }
});

tokenSchema.statics = {
    load: (id, cb) => this.findOne({_id: id}).exec(cb)
};

module.exports = mongoose.model("AccessToken", tokenSchema);