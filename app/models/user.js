"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    is_syncing: {
        type: Boolean
    },
    is_import: {
        type: Boolean
    }
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
