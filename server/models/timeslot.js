var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var timeslotSchema = new Schema({
    date: { type: Date, required: true },
    time: { type: int, required: true },
    attendees: { type: int }
});

module.exports = mongoose.model('timeslots', timeslotSchema);