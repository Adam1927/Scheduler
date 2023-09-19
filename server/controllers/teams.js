var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Team = require('../models/team');
const auth = require('../middleware/auth');


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
            return res.status(403).json({ 'message': 'Only team manager can create events' });
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


module.exports = router;