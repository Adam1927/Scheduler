var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
    name: { type: String, required: true },
    team: { type: Schema.Types.ObjectId, ref: 'teams', required: true, immutable: true },
    slots: { type: [Schema.Types.ObjectId], ref: 'timeslots' },
    startDate: { type: Date, require: true, immutable: true },
    endDate: { type: Date, require: true, immutable: true },
    numberOfSlots: { type: Number }
});

module.exports = mongoose.model('events', eventSchema);