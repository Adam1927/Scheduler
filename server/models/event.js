var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
    name: { type: String, required: true },
    team: { type: Schema.Types.ObjectId, ref: 'teams', required: true, immutable: true },
    slots: { type: [Schema.Types.ObjectId], ref: 'timeslots' },
    startDate: { type: Date, require: true, immutable: true },
    endDate: { type: Date, require: true, immutable: true },
    numberOfSlots: { type: Number },
    usersVoted: { type: [Schema.Types.ObjectId], ref: 'users' },
    numberOfVotes: { type: Number, default: 0 },
    isLocked: { type: Boolean, default: false },
    selectedSlot: { type: Schema.Types.ObjectId, ref: 'timeslots' }
});

module.exports = mongoose.model('events', eventSchema);