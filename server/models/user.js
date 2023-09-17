var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    teams: { type: [Schema.Types.ObjectID], ref: 'teams'}
});

module.exports = mongoose.model('users', userSchema);