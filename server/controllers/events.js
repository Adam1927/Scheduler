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
        if (req.body.userId !== req.body.team.manager) {
            return res.status(403).json({ 'message': 'Only team manager can create events' });
        }

        // Add the new event
        const event = new Event({
            name: req.body.name,
            team: req.body.team,
            startDate: req.body.startDate,
            endDate: req.body.endDate
        });

        numberOfSlots = 0

        // Add timeslots
        for (var d = event.startDate; d <= event.endDate; d.setDate(d.getDate() + 1)) {
            for (var t = 8; t < 17; t += 1) {
                event.slots.push(new Timeslot({
                    date: d,
                    time: t,
                    attendees: 0
                }))
                numberOfSlots += 1
            }
        }

        event.numberOfSlots = numberOfSlots;

        await event.save();

        // Success response
        res.status(201).json({
            'message': 'Event created successfully',
            'id': event._id,
            'links': [{
                'rel': 'self',
                'type': 'PATCH',
                'href': 'http://127.0.0.1:3000/api/events/' + event._id,
            }, {
                'rel': 'self',
                'type': 'GET',
                'href': 'http://127.0.0.1:3000/api/events/' + event._id,
            }, {
                'rel': 'self',
                'type': 'DELETE',
                'href': 'http://127.0.0.1:3000/api/events/' + event._id,
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

        if (!team.members.includes(req.body.userId)) {
            return res.status(404).json({ 'message': 'User is not a member of this team' });
        }

        var slots = event.slots;
        var availabilities = req.body.availabilities;

        for (i = 0; i < event.numberOfSlots; i = i + 1) {
            if (availabilities[i] == 1) {
                var slot = await Timeslot.findById(slots[i]);
                slot.attendees += 1;
                await slot.save();
            }
        }

        // Success response
        res.status(201).json({
            'message': 'Availabilities updated successfully',
            'id': event._id,
            'links': [{
                'rel': 'self',
                'type': 'PATCH',
                'href': 'http://127.0.0.1:3000/api/events/' + event._id,
            }, {
                'rel': 'self',
                'type': 'GET',
                'href': 'http://127.0.0.1:3000/api/events/' + event._id,
            }, {
                'rel': 'self',
                'type': 'DELETE',
                'href': 'http://127.0.0.1:3000/api/events/' + event._id,
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


router.get('/api/events/:id', auth, async function (req, res, next) {
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

        // Success response
        res.status(200).json({
            'message': 'Event found',
            'id': event._id,
            'event': event,
            'links': [{
                'rel': 'self',
                'type': 'PATCH',
                'href': 'http://127.0.0.1:3000/api/events/' + event._id,
            }, {
                'rel': 'self',
                'type': 'DELETE',
                'href': 'http://127.0.0.1:3000/api/events/' + event._id,
            }]
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            'error': err
        });
    }
});


router.get('/api/events/:event_id/optimal_time', auth, async function (req, res, next) {
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
        if (req.body.userId !== req.body.team.manager) {
            return res.status(403).json({ 'message': 'Only team manager can get optimal time' });
        }

        optTime = event.slots.slice(0,5);

        // Success response
        res.status(200).json({
            'message': 'Event found',
            'id': event._id,
            'optimal_time': optTime,
            'links': [{
                'rel': 'self',
                'type': 'PATCH',
                'href': 'http://127.0.0.1:3000/api/events/' + event._id,
            }, {
                'rel': 'self',
                'type': 'DELETE',
                'href': 'http://127.0.0.1:3000/api/events/' + event._id,
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
            'message': 'Event found',
            'event': event,
            'slot': slot,
            'links': [{
                'rel': 'self',
                'type': 'DELETE',
                'href': 'http://127.0.0.1:3000/api/events/' + event._id + '/slots/' + slot._id,
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

        // Change name
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
                    'href': 'http://127.0.0.1:3000/api/events/' + event._id,
                }, {
                    'rel': 'self',
                    'type': 'DELETE',
                    'href': 'http://127.0.0.1:3000/api/events/' + event._id,
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
        Timeslot.deleteMany({ '_id': { $in: event.slots } });

        // Success response
        res.status(200).json({
            'message': 'Event deleted',
            'links': {
                'rel': 'self',
                'type': 'POST',
                'href': 'http://127.0.0.1:3000/api/events',
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

        // Delete timeslota
        Timeslot.findOneAndDelete({ _id: slot_id });

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

        // Delete event' timeslots
        var events = Event.find();
        if (events.length !== 0) {
            for (var e in events) {
                Event.deleteMany({ '_id': { $in: e.slots } });
            }
        }

        // Delete all events
        Event.deleteMany();

        // Success response
        res.status(200).json({
            'message': 'Events deleted',
            'links': {
                'rel': 'self',
                'type': 'POST',
                'href': 'http://127.0.0.1:3000/api/events',
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