var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
    name: { type: String, required: true},
    team: { type: Schema.Types.ObjectID, ref: 'teams', required: true},
    slots: { type: [Schema.Types.ObjectID], ref: 'timeslots' },
    startDate: { type: Date },
    endDate: { type: Date }
});

module.exports = mongoose.model('events', eventSchema);