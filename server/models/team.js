var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teamSchema = new Schema({
    name: { type: String, required: true},
    manager: { type: Schema.Types.ObjectId, ref: 'users', required: true},
    members: { type: [Schema.Types.ObjectId], ref: 'users' },
    events: { type: [Schema.Types.ObjectId], ref: 'events' }
});

module.exports = mongoose.model('teams', teamSchema);