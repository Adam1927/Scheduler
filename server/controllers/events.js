var express = require('express');
var router = express.Router();
var Event = require('../models/event');
var Team = require('../models/team');
var Timeslot = require('../models/timeslot');
const auth = require('../middleware/auth');


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

        // Add timeslots
        for (var d = event.startDate; d <= event.endDate; d.setDate(d.getDate() + 1)) {
            for (var t = 8; t < 17; t += 1) {
                event.slots.push(new Timeslot({
                    date: d,
                    time: t,
                    attendees: 0
                }))
            }
        }

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


router.get('/api/event/:id', auth, async function (req, res, next) {
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
            'name': event.name,
            'id': event._id,
            'team': event.team,
            'startDate': event.startDate,
            'endDate': event.endDate,
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


module.exports = router;