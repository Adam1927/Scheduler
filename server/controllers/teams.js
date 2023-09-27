var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Team = require('../models/team');
const auth = require('../middleware/auth');
require('dotenv').config();
const authKey = process.env.AUTH_KEY;


router.post('/api/teams', auth, async function (req, res, next) {
    try {

        // API versioning
        if (req.header('X-API-Version') !== 'v1') {
            return res.status(400).json({ 'message': 'API version not found' });
        }

        // Add the new team
        const team = new Team({
            name: req.body.name,
            manager: req.body.manager
        });

        await team.save();

        // Add team to user's list
        var user = await User.findById(req.body.user);
        user.managedTeams.push(team._id);
        await user.save();

        // Success response
        res.status(201).json({
            'message': 'Team created successfully',
            'id': team._id,
            'links': [{
                'rel': 'self',
                'type': 'GET',
                'href': 'http://127.0.0.1:3000/api/teams/' + team._id,
            }, {
                'rel': 'self',
                'type': 'PATCH',
                'href': 'http://127.0.0.1:3000/api/teams/' + team._id,
            }, {
                'rel': 'self',
                'type': 'PUT',
                'href': 'http://127.0.0.1:3000/api/teams/' + team._id,
            }, {
                'rel': 'self',
                'type': 'DELETE',
                'href': 'http://127.0.0.1:3000/api/teams/' + team._id,
            }]
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err,
            'message': 'Team creation failed'
        });
    }
});


router.post('/api/teams/:team_id/members', auth, async function (req, res, next) {
    var team_id = req.params.team_id;
    try {

        // API versioning
        if (req.header('X-API-Version') !== 'v1') {
            return res.status(400).json({ 'message': 'API version not found' });
        }

        var team = await Team.findById(team_id);

        //Check if team exists
        if (team === null) {
            return res.status(404).json({ 'message': 'Team not found' });
        }

        // Check manager status
        if (req.body.userId !== team.manager) {
            return res.status(403).json({ 'message': 'Only team manager can add members' });
        }

        const usernames = req.body.usernames;
        var failed = [];
        for (var username in usernames) {
            var user = await User.findOne({ username }).exec();
            if (!user) {
                failed.push(username);
            } else {
                team.members.push(user._id);
                user.managedTeams.push(team_id);
                await user.save();
            }
        }

        await team.save();

        // Success response
        res.status(200).json({
            'message': 'Team members added successfully',
            'id': team._id,
            'invalidUsernames': failed,
            'links': [{
                'rel': 'self',
                'type': 'GET',
                'href': 'http://127.0.0.1:3000/api/teams/' + team._id + '/members',
            }]
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err,
            'message': 'Member addition failed'
        });
    }
});


router.get('/api/teams/:id', auth, async function (req, res, next) {
    var id = req.params.id;
    try {
  
      // API versioning
      if (req.header('X-API-Version') !== 'v1') {
        return res.status(400).json({ 'message': 'API version not found' });
      }
  
      // Find team
      var team = await Team.findById(id);
      if (team === null) {
        return res.status(404).json({ 'message': 'Team not found' });
      }
  
      // Success response
      res.status(200).json({
        'message': 'Team found',
        'team': team,
        'links': [
          {
            'rel': 'self',
            'type': 'PUT',
            'href': 'http://127.0.0.1:3000/api/teams/' + team._id,
          },
          {
            'rel': 'self',
            'type': 'DELETE',
            'href': 'http://127.0.0.1:3000/api/teams/' + team._id,
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


router.get('/api/teams', auth, async function (req, res, next) {
    try {

        // API versioning
        if (req.header('X-API-Version') !== 'v1') {
            return res.status(400).json({ 'message': 'API version not found' });
        }

        var teams = Team.find();

        if (teams.length === 0) {
            return res.status(404).json({ 'message': 'No teams found' });
        }

        // Success response
        res.status(200).json({
            'message': 'Teams found',
            'teams': teams,
            'links': [
                {
                    'rel': 'self',
                    'type': 'POST',
                    'href': 'http://127.0.0.1:3000/api/teams',
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

router.put('/api/teams/:id', auth, async function (req, res, next) {
    var id = req.params.id;
    try {

        // API versioning
        if (req.header('X-API-Version') !== 'v1') {
            return res.status(400).json({ 'message': 'API version not found' });
        }

        // Find team
        var team = await Team.findById(id);
        if (team === null) {
            return res.status(404).json({ 'message': 'Team not found' });
        }

        // Check manager status
        if (req.body.userId !== team.manager) {
            return res.status(403).json({ 'message': 'Only team manager can update team' });
        }

        if (!req.body.name) {
            return res.status(404).json({ 'message': 'Name cannot be empty' });
        }

        if (!req.body.managerUsername) {
            return res.status(404).json({ 'message': "Manager's username cannot be empty" });
        }

        // Update team info
        team.name = req.body.name;
        var oldManager = team.manager;
        team.members.push(oldManager);
        var newManager = await Team.findById(req.body.managerUsername);
        team.manager = newManager;
        await team.save();

        // Success response
        res.status(200).json({
            'message': 'Team has been updated',
            'id': team._id,
            'links': [
                {
                    'rel': 'self',
                    'type': 'GET',
                    'href': 'http://127.0.0.1:3000/api/teams/' + team._id,
                },
                {
                    'rel': 'self',
                    'type': 'DELETE',
                    'href': 'http://127.0.0.1:3000/api/teams/' + team._id,
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

router.delete('/api/teams/:id', auth, async function (req, res, next) {
    var id = req.params.id;
    try {

        // API versioning
        if (req.header('X-API-Version') !== 'v1') {
            return res.status(400).json({ 'message': 'API version not found' });
        }

        // Find and delete team
        const team = await Team.findOneAndDelete({ _id: id });
        if (team === null) {
            return res.status(404).json({ 'message': 'Team not found' });
        }

        // Find and delete events and slots
        var events = Event.find({ '_id': { $in: team.events } });
        for (var e in events) {
            Timeslot.deleteMany({ '_id': { $in: e.slots } });
        }
        Event.deleteMany({ '_id': { $in: events } });

        // Success response
        res.status(200).json({
            'message': 'Team deleted',
            'links': {
                'rel': 'self',
                'type': 'POST',
                'href': 'http://127.0.0.1:3000/api/teams',
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            'error': err
        });
    }
});


router.delete('/api/teams', auth, async function (req, res, next) {
    try {

        // API versioning
        if (req.header('X-API-Version') !== 'v1') {
            return res.status(400).json({ 'message': 'API version not found' });
        }

        // Check user authorization 
        if (req.header('X-Secret') !== authKey) {
            res.status(403).json({ 'message': 'Unauthorized' });
        }

        // Delete events and timeslots
        var teams = Team.find();
        if (teams.length !== 0) {
            for (var t in teams) {
                var events = Event.find({ '_id': { $in: t.events } });
                for (var e in events) {
                    Timeslot.deleteMany({ '_id': { $in: e.slots } });
                }
                Event.deleteMany({ '_id': { $in: events } });
            }
        }

        // Delete all teams
        Team.deleteMany();

        // Success response
        res.status(200).json({
            'message': 'Teams deleted',
            'links': {
                'rel': 'self',
                'type': 'POST',
                'href': 'http://127.0.0.1:3000/api/teams',
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