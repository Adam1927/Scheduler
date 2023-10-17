var express = require('express');
var router = express.Router();
var Event = require('../models/event');
var Team = require('../models/team');
var Timeslot = require('../models/timeslot');
const auth = require('../middleware/auth');
require('dotenv').config();
const authKey = process.env.AUTH_KEY;


router.post('/api/events', auth, async function (req, res, next) {
    try {

        // API versioning
        if (req.header('X-API-Version') !== 'v1') {
            return res.status(400).json({ 'message': 'API version not found' });
        }

        // Check manager status
        if (req.body.userId != req.body.team.manager) {
            return res.status(403).json({ 'message': 'Only team manager can create events' });
        }

        // Add the new event
        const event = new Event({
            name: req.body.name,
            team: req.body.team,
            startDate: new Date(req.body.startDate),
            endDate: new Date(req.body.endDate)
        });

        numberOfSlots = 0;

        // Add timeslots
        for (var d = new Date(event.startDate); d <= event.endDate; d.setDate(d.getDate() + 1)) {
            for (var t = 8; t < 17; t += 1) {
                var slot = new Timeslot({
                    date: new Date(d),
                    time: t,
                    attendees: 0
                });
                event.slots.push(slot._id);
                numberOfSlots += 1;
                await slot.save();
            }
        }

        event.numberOfSlots = numberOfSlots;

        await event.save();

        const team = await Team.findById(req.body.team);
        team.events.push(event._id);
        await team.save();

        // Success response
        res.status(201).json({
            'message': 'Event created successfully',
            'id': event._id,
            'links': [{
                'rel': 'self',
                'type': 'PATCH',
                'href': 'http://localhost:3000/api/events/' + event._id,
            }, {
                'rel': 'self',
                'type': 'GET',
                'href': 'http://localhost:3000/api/events/' + event._id,
            }, {
                'rel': 'self',
                'type': 'DELETE',
                'href': 'http://localhost:3000/api/events/' + event._id,
            }]
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err,
            'message': 'Event creation failed'
        });
    }
});


router.post('/api/events/:event_id/availability', auth, async function (req, res, next) {
    var event_id = req.params.event_id;
    try {

        // API versioning
        if (req.header('X-API-Version') !== 'v1') {
            return res.status(400).json({ 'message': 'API version not found' });
        }

        var event = await Event.findById(event_id);

        //Check if event exists
        if (event === null) {
            return res.status(404).json({ 'message': 'Event not found' });
        }

        //Check if user is member
        var team = await Team.findById(event.team);
        if (!team.members.includes(req.body.userId) && team.manager != req.body.userId) {
            return res.status(403).json({ 'message': 'User is not a member of this team' });
        }

        //Check if user has already voted
        if (event.usersVoted.includes(req.body.userId)) {
            return res.status(403).json({ 'message': 'User has already voted' });
        }

        var slots = event.slots;
        var availabilities = req.body.availabilities;

        for (i = 0; i < event.numberOfSlots; i = i + 1) {
            if (availabilities[i] == true) {
                var slot = await Timeslot.findById(slots[i]);
                slot.attendees += 1;
                await slot.save();
            }
        }

        event.usersVoted.push(req.body.userId);
        event.numberOfVotes += 1;

        await event.save();

        // Success response
        res.status(200).json({
            'message': 'Availabilities updated successfully',
            'id': event._id,
            'links': [{
                'rel': 'self',
                'type': 'PATCH',
                'href': 'http://localhost:3000/api/events/' + event._id,
            }, {
                'rel': 'self',
                'type': 'GET',
                'href': 'http://localhost:3000/api/events/' + event._id,
            }, {
                'rel': 'self',
                'type': 'DELETE',
                'href': 'http://localhost:3000/api/events/' + event._id,
            }]
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err,
            'message': 'Availabilities failed to update'
        });
    }
});


router.post('/api/events/:id/selected_slot', auth, async function (req, res, next) {
    var id = req.params.id;
    try {
        
        // API versioning
        if (req.header('X-API-Version') !== 'v1') {
            return res.status(400).json({ 'message': 'API version not found' })
        }

        // Find event
        var event = await Event.findById(id);
        if (event === null) {
            return res.status(404).json({ 'message': 'Event not found' });
        }

        // Check manager status
        var team = await Team.findById(event.team);
        if (req.body.userId != team.manager) {
            return res.status(403).json({ 'message': 'Only team manager can select slot' });
        }

        // Check if event is locked
        if (event.isLocked) {
            return res.status(403).json({ 'message': 'Event is locked' });
        }

        // Check if slot exists
        var slot = await Timeslot.findById(req.body.slotId);
        if (slot === null) {
            return res.status(404).json({ 'message': 'Slot not found' });
        }

        // Save selected slot
        event.selectedSlot = slot._id;
        event.isLocked = true;
        await event.save();

        // Success response
        res.status(200).json({
            'message': 'Selected slot saved',
            'id': event._id
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            'error': err
        });
    }
});


router.get('/api/events/:id', auth, async function (req, res, next) {
    var id = req.params.id;
    try {

        // API versioning
        if (req.header('X-API-Version') !== 'v1') {
            return res.status(400).json({ 'message': 'API version not found' })
        }

        // Find event
        var event = await Event.findById(id).populate('selectedSlot');
        if (event === null) {
            return res.status(404).json({ 'message': 'Event not found' });
        }

        // Success response
        res.status(200).json({
            'message': 'Event found',
            'id': event._id,
            'event': event,
            'links': [{
                'rel': 'self',
                'type': 'PATCH',
                'href': 'http://localhost:3000/api/events/' + event._id,
            }, {
                'rel': 'self',
                'type': 'DELETE',
                'href': 'http://localhost:3000/api/events/' + event._id,
            }]
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            'error': err
        });
    }
});


router.post('/api/events/:event_id/optimal_time', auth, async function (req, res, next) {
    var event_id = req.params.event_id;
    try {

        // API versioning
        if (req.header('X-API-Version') !== 'v1') {
            return res.status(400).json({ 'message': 'API version not found' })
        }

        // Find event
        const event = await Event.findById(event_id).populate({
            path: 'slots',
            model: 'timeslots',
            options: { sort: { attendees: -1, date: 1, time: 1 } }
        });

        if (event === null) {
            return res.status(404).json({ 'message': 'Event not found' });
        }

        // Check manager status
        var team = await Team.findById(event.team);
        if (req.body.userId != team.manager) {
            return res.status(403).json({ 'message': 'Only team manager can get optimal time' });
        }

        optTime = event.slots.slice(0, 5);

        // Success response
        res.status(200).json({
            'message': 'Optimal time found',
            'id': event._id,
            'optimal_time': optTime,
            'numberOfVotes': event.numberOfVotes,
            'links': [{
                'rel': 'self',
                'type': 'PATCH',
                'href': 'http://localhost:3000/api/events/' + event._id,
            }, {
                'rel': 'self',
                'type': 'DELETE',
                'href': 'http://localhost:3000/api/events/' + event._id,
            }]
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            'error': err
        });
    }
});


router.get('/api/events/:event_id/slots/:slot_id', auth, async function (req, res, next) {
    var event_id = req.params.event_id;
    var slot_id = req.params.slot_id;
    try {

        // API versioning
        if (req.header('X-API-Version') !== 'v1') {
            return res.status(400).json({ 'message': 'API version not found' })
        }

        // Find event
        var event = await Event.findById(event_id);
        if (event === null) {
            return res.status(404).json({ 'message': 'Event not found' });
        }

        // Find timeslot
        var slot = await Timeslot.findById(slot_id);
        if (slot === null) {
            return res.status(404).json({ 'message': 'Timeslot not found' });
        }

        // Success response
        res.status(200).json({
            'message': 'Timeslot found',
            'event': event,
            'slot': slot,
            'links': [{
                'rel': 'self',
                'type': 'DELETE',
                'href': 'http://localhost:3000/api/events/' + event._id + '/slots/' + slot._id,
            }]
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            'error': err
        });
    }
});


router.patch('/api/events/:id', auth, async function (req, res, next) {
    var id = req.params.id;
    try {

        // API versioning
        if (req.header('X-API-Version') !== 'v1') {
            return res.status(400).json({ 'message': 'API version not found' });
        }

        // Find event by id
        var event = await Event.findById(id);
        if (event === null) {
            return res.status(404).json({ 'message': 'Event not found' });
        }

        // Change event name
        if (req.body.name) {
            event.name = req.body.name;
        }

        await event.save();

        // Success response
        res.status(200).json({
            'message': 'Event has been updated',
            'id': event._id,
            'links': [
                {
                    'rel': 'self',
                    'type': 'GET',
                    'href': 'http://localhost:3000/api/events/' + event._id,
                }, {
                    'rel': 'self',
                    'type': 'DELETE',
                    'href': 'http://localhost:3000/api/events/' + event._id,
                }
            ]
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            'error': err
        });
    }
});

router.delete('/api/events/:id', auth, async function (req, res, next) {
    var id = req.params.id;
    try {

        // API versioning
        if (req.header('X-API-Version') !== 'v1') {
            return res.status(400).json({ 'message': 'API version not found' });
        }

        // Find and delete event
        const event = await Event.findOneAndDelete({ _id: id });
        if (event === null) {
            return res.status(404).json({ 'message': 'Event not found' });
        }

        // Delete event's slots
        await Timeslot.deleteMany({ '_id': { $in: event.slots } });

        // Success response
        res.status(200).json({
            'message': 'Event deleted',
            'links': {
                'rel': 'self',
                'type': 'POST',
                'href': 'http://localhost:3000/api/events',
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            'error': err
        });
    }
});


router.delete('/api/events/:event_id/slots/:slot_id', auth, async function (req, res, next) {
    var event_id = req.params.event_id;
    var slot_id = req.params.slot_id;
    try {

        // API versioning
        if (req.header('X-API-Version') !== 'v1') {
            return res.status(400).json({ 'message': 'API version not found' });
        }

        //Remove slot from event
        var event = await Event.findById(event_id);
        event.slots.pull(slot_id);
        await event.save();

        // Delete timeslot
        await Timeslot.findOneAndDelete({ _id: slot_id });

        // Success response
        res.status(200).json({ 'message': 'Timeslot deleted', });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            'error': err
        });
    }
});


router.delete('/api/events', auth, async function (req, res, next) {
    try {

        // API versioning
        if (req.header('X-API-Version') !== 'v1') {
            return res.status(400).json({ 'message': 'API version not found' });
        }

        // Check user authorization 
        if (req.header('X-Secret') !== authKey) {
            res.status(403).json({ 'message': 'Unauthorized' });
        }

        // Delete all timeslots and events
        await Timeslot.deleteMany({});
        await Event.deleteMany({});

        // Success response
        res.status(200).json({
            'message': 'Events deleted',
            'links': {
                'rel': 'self',
                'type': 'POST',
                'href': 'http://localhost:3000/api/events',
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            'error': err
        });
    }
});


module.exports = router;