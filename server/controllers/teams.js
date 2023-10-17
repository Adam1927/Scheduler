var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Team = require('../models/team');
var Event = require('../models/event');
const ObjectId = require('mongoose').Types.ObjectId;
var Timeslot = require('../models/timeslot');
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
            manager: req.body.user 
        });

        // Add members to the team
        if (req.body.members) {
            for (const member of req.body.members) {
              // something doesn't work here or elsewhere. When teams are created no members are added to the team document in the database
                if (team.members.indexOf(member) === -1) {
                    team.members.push(member);
                    const user = await User.findById(member);
                    user.memberOfTeams.push(team._id);
                    await user.save();
                }
            }
        }

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
                'href': 'http://localhost:3000/api/teams/' + team._id,
            }, {
                'rel': 'self',
                'type': 'PUT',
                'href': 'http://localhost:3000/api/teams/' + team._id,
            }, {
                'rel': 'self',
                'type': 'DELETE',
                'href': 'http://localhost:3000/api/teams/' + team._id,
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
      console.log('etam', request.body.members)

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
        if (req.body.userId != team.manager) {
            return res.status(403).json({ 'message': 'Only team manager can add members' });
        }

        // Add members to the team
        if (req.body.members) {
            for (const member of req.body.members) {
              const validUsername = await User.findOne({ username: member}).exec()
              if(validUsername) {
                member = validUsername._id
              }
              if((ObjectId.isValid(member))&&((String)(new ObjectId(id)) === id)){
                  if (team.members.indexOf(member) === -1) {
                    team.members.push(member);
                    const user = await User.findById(member);
                    user.memberOfTeams.push(team_id);
                    await user.save();
                }
              }else {
                return res.status(403).json({ 'message': 'Usernames or member object IDs are invalid' })
              }
            }
        }

        await team.save();
        console.log('team', team)
        // Success response
        res.status(200).json({
            'message': 'Team members added successfully',
            'id': team._id,
            'links': [{
                'rel': 'self',
                'type': 'GET',
                'href': 'http://localhost:3000/api/teams/' + team._id + '/members',
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

        // Find team and populate the event field
        var team = await Team.findById(id).populate('events').populate('members');
        if (team === null) {
            return res.status(404).json({ 'message': 'Team not found' });
        }

        if(req.query.teamPopulate === 'true') {
          await team.populate([
            { path: 'manager', select: 'name username' },
            { path: 'members', select: 'name username' },
            { path: 'events', select: 'name startDate endDate' }
          ])
        }
        await team.save();
        console.log('team', team)


        // Success response
        res.status(200).json({
            'message': 'Team found',
            'team': team,
            'links': [
                {
                    'rel': 'self',
                    'type': 'PUT',
                    'href': 'http://localhost:3000/api/teams/' + team._id,
                },
                {
                    'rel': 'self',
                    'type': 'DELETE',
                    'href': 'http://localhost:3000/api/teams/' + team._id,
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

        const query = await Team.find().lean();

        if (req.query.select) {
            query.select(req.query.select); // Field selection
        }

        // Check if a sorting query is provided
        if (req.query.sortBy) {
            const sort = {};
            sort[req.query.sortBy] = req.query.sortOrder || 'asc';
            query.sort(sort); // Apply sorting
        }

        const teams = await query.exec();

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
                    'href': 'http://localhost:3000/api/teams',
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
        if (req.body.userId != team.manager) {
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

        if (req.body.newManager) {
          var newManager = await User.findOne({ username: req.body.managerUsername }).exec()
          if (newManager == null) {
            return res.status(404).json({ 'message': "Username must be registered" });
          }
          var oldManager = team.manager
          team.members.push(oldManager)
          team.manager = newManager._id
        }
        
        await team.save();

        // Success response
        res.status(200).json({
            'message': 'Team has been updated',
            'id': team._id,
            'links': [
                {
                    'rel': 'self',
                    'type': 'GET',
                    'href': 'http://localhost:3000/api/teams/' + team._id,
                },
                {
                    'rel': 'self',
                    'type': 'DELETE',
                    'href': 'http://localhost:3000/api/teams/' + team._id,
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
        var events = await Event.find({ '_id': { $in: team.events } });
        for (const e of events) {
            await Timeslot.deleteMany({ '_id': { $in: e.slots } });
        }
        await Event.deleteMany({ '_id': { $in: events } });

        // Remove the team from user's teams
        var manager = await User.findById(team.manager);
        manager.managedTeams.pull(team._id);
        await manager.save();
        await User.updateMany(
            { _id: { $in: team.members } },
            { $pull: { memberOfTeams: team._id } }
        );

        // Success response
        res.status(200).json({
            'message': 'Team deleted',
            'links': {
                'rel': 'self',
                'type': 'POST',
                'href': 'http://localhost:3000/api/teams',
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            'error': err
        });
    }
});

router.delete('/api/teams/:id/events', auth, async function (req, res, next) {
    var id = req.params.id;
    try {

        // API versioning
        if (req.header('X-API-Version') !== 'v1') {
            return res.status(400).json({ 'message': 'API version not found' });
        }

        // Find team
        const team = await Team.findById(id);
        if (team === null) {
            return res.status(404).json({ 'message': 'Team not found' });
        }


        // Delete events and slots
        var events = await Event.find({ '_id': { $in: team.events } });
        for (const e of events) {
            await Timeslot.deleteMany({ '_id': { $in: e.slots } });
        }
        await Event.deleteMany({ '_id': { $in: events } });

        // Remove the events from team's events
        team.events = [];
        await team.save();

        // Success response
        res.status(200).json({
            'message': 'Events deleted'
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
            return res.status(403).json({ 'message': 'Unauthorized' });
        }

        // Delete all timeslots, events, and teams
        await Timeslot.deleteMany({});
        await Event.deleteMany({});
        await Team.deleteMany({});

        // Delete all users' teams
        var users = await User.find();
        for (u of users) {
            u.managedTeams = [];
            u.memberOfTeams = [];
            await u.save();
        }

        // Success response
        res.status(200).json({
            'message': 'Teams deleted',
            'links': {
                'rel': 'self',
                'type': 'POST',
                'href': 'http://localhost:3000/api/teams',
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            'error': err
        });
    }
});

router.delete('/api/teams/:team_id/members/:user_id', auth, async function (req, res, next) {
  const teamId = req.params.team_id;
  const userId = req.params.user_id;

  try {
      // API versioning
      if (req.header('X-API-Version') !== 'v1') {
          return res.status(400).json({ 'message': 'API version not found' });
      }

      const team = await Team.findById(teamId);
      // Check if team exists
      if (!team) {
          return res.status(404).json({ 'message': 'Team not found' });
      }
      console.log('hi')
      console.log(req.body.requesterID)
      console.log(team.manager._id.toString())
      // Check if the user is the manager of the team
      if (req.body.requesterID !== team.manager._id.toString()) {
          return res.status(403).json({ 'message': 'Only the team manager can remove members' });
      }
      console.log('hi2')

      const userToRemove = await User.findById(userId);
      // Check if the user to remove exists
      if (!userToRemove) {
          return res.status(404).json({ 'message': 'User not found' });
      }
      console.log('hi3')
      // Check if the user to remove is a member of the team
      if (!team.members.includes(userId)) {
          return res.status(404).json({ 'message': 'User is not a member of the team' });
      }

      // Remove the user from the team's members
      team.members.pull(userId);
      await team.save();

      // Remove the team from the user's memberOfTeams
      userToRemove.memberOfTeams.pull(teamId);
      await userToRemove.save();

      // Success response
      res.status(200).json({
          'message': 'Team member removed successfully',
          'teamId': teamId,
          'userId': userId,
          'links': [
              {
                  'rel': 'self',
                  'type': 'GET',
                  'href': `http://localhost:3000/api/teams/${teamId}`,
              },
          ],
      });
  } catch (err) {
      console.log(err);
      res.status(500).json({
          'error': err,
          'message': 'Failed to remove team member',
      });
  }
});



module.exports = router;