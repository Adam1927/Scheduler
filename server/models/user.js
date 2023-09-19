var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    managedTeams: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    }],
    memberOfTeams: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    }]
});

module.exports = mongoose.model('users', userSchema);