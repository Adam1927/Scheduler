var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    managedTeams: [{
        type: Schema.Types.ObjectId,
        ref: 'teams'
    }],
    memberOfTeams: [{
        type: Schema.Types.ObjectId,
        ref: 'teams'
    }]
});

module.exports = mongoose.model('users', userSchema);