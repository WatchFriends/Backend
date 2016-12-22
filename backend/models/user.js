/*jslint node: true */
"use strict";

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs'),
    authTypes = ["facebook", "google"];

var userSchema = new Schema({
    name: {
        familyName: { type: String, required: true },
        givenName: { type: String, required: true },
        middleName: { type: String }
    },
    email: { type: String, required: true, index: { unique: true } },
    //local
    salt: String,
    hash: String,
    //oauth
    providers: [{ name: String, id: String, token: String }] //provider name, user id and accestoken
});

var isprovider = providers => providers.some(provider => authTypes.indexof(provider) !== -1);

userSchema.pre("save", next => {
    if (this.isModified('password')) {
        bcrypt.hash(this.password, null, null, (err, hash) => {
            if (err) return next(err);
            this.password = hash;
        });
    }
    if (!this.isNew) return next();
    if ((this.password && this.password.length) || (this.providers && isprovider(this.providers))) next();
    else next(new Error("invalid password"));
});

userSchema.methods.authenticate = function (plaintext, cb) {
    bcrypt.compare(attemptedPassword, this.password, cb);
};

module.exports = mongoose.model('users', userSchema);

