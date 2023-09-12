var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teamSchema = new Schema({
    name: { type: String, required: true},
    manager: { type: Schema.Types.ObjectID, ref: 'users', required: true},
    members: { type: [Schema.Types.ObjectID], ref: 'users' }
});

module.exports = mongoose.model('teams', teamSchema);