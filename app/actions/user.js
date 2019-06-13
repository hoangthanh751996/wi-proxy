const mongoose = require("mongoose");
const User = mongoose.model("User");

const findAll = (filter = {}) => {
    const conditions = {};
    if (filter.username) {
        conditions["username"] = filter.username;
    }
    return User.find(conditions)
};

const findOne = (filter = {}) => {
    const conditions = {};
    if (filter.username) {
        conditions["username"] = filter.username;
    }
    if (Object.keys(conditions).length === 0) return;
    return User.findOne(conditions);
};

const create = (info) => {
    return new User({...info}).save();
};

const update = (_id, diff) => {
    return User.findOneAndUpdate({_id: mongoose.Types.ObjectId(_id)},
        {
            $set: {...diff}
        },
        {
            returnNewDocument: true,
            new: true,
            upsert: false
        });
};

module.exports = {
    findAll,
    findOne,
    create,
    update
};
