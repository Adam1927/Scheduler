var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var timeslotSchema = new Schema({
    date: { type: Date, required: true },
    time: { type: Number, required: true },
    attendees: { type: Number }
});

module.exports = mongoose.model('timeslots', timeslotSchema);