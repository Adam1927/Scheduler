var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var timeslotSchema = new Schema({
    datetime: { type: datetime, required: true },
    attendees: { type: int, default: 0}
});

module.exports = mongoose.model('timeslots', timeslotSchema);