var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Team = require('../models/team');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');


router.post('/api/users/register', async function (req, res, next) {
  try {

    // API versioning
    if (req.header('X-API-Version') !== 'v1') {
      return res.status(400).json({ 'message': 'API version not found' });
    }

    // Check for existing username
    const usernames = await User.find({ username: req.body.username }).exec();
    if (usernames.length >= 1) {
      return res.status(409).json({
        'message': 'Username already exists'
      });
    }

    // Add the new user
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      password: hash,
      name: req.body.name
    });
    await user.save();

    // Start session
    req.session.user = user;

    // Success response
    res.status(201).json({
      'message': 'Registration successful',
      'id': user._id,
      'links': [{
        'rel': 'self',
        'type': 'PUT',
        'href': 'http://127.0.0.1:3000/api/users/' + user._id,
      }, {
        'rel': 'self',
        'type': 'PATCH',
        'href': 'http://127.0.0.1:3000/api/users/' + user._id,
      }, {
        'rel': 'self',
        'type': 'GET',
        'href': 'http://127.0.0.1:3000/api/users/' + user._id,
      }, {
        'rel': 'self',
        'type': 'DELETE',
        'href': 'http://127.0.0.1:3000/api/users/' + user._id,
      }]
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
      'message': 'Registration failed'
    });
  }
});


router.post('/api/users/login', async function (req, res, next) {
  try {

    // API versioning
    if (req.header('X-API-Version') !== 'v1') {
      return res.status(400).json({ 'message': 'API version not found' });
    }

    // Check user info
    const { username, password } = req.body;
    const user = await User.findOne({ username }).exec();
    if (!user) {
      return res.status(401).json({ 'message': 'Log-in failed' });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ 'message': 'Log-in failed' });
    }

    // Start session
    req.session.user = user;

    // Success response
    res.status(200).json({
      'message': 'Log-in successful',
      'id': user._id,
      'links': [{
        'rel': 'self',
        'type': 'PUT',
        'href': 'http://127.0.0.1:3000/api/users/' + user._id,
      }, {
        'rel': 'self',
        'type': 'PATCH',
        'href': 'http://127.0.0.1:3000/api/users/' + user._id,
      }, {
        'rel': 'self',
        'type': 'GET',
        'href': 'http://127.0.0.1:3000/api/users/' + user._id,
      }, {
        'rel': 'self',
        'type': 'DELETE',
        'href': 'http://127.0.0.1:3000/api/users/' + user._id,
      }]
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ 'error': err, 'message': 'Log-in failed' });
  }
});


router.post('/api/users/logout', async function (req, res, next) {
  try {

    // API versioning
    if (req.header('X-API-Version') !== 'v1') {
      return res.status(400).json({ 'message': 'API version not found' });
    }

    // End session
    await req.session.destroy();

    // Success response
    res.status(200).json({ 'message': 'Logout successful' });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      'error': err
    });
  }
});


router.get('/api/users', auth, async function (req, res, next) {
  try {

    // API versioning
    if (req.header('X-API-Version') !== 'v1') {
      return res.status(400).json({ 'message': 'API version not found' });
    }

    var users = User.find();

    if (users.length === 0) {
      return res.status(404).json({ 'message': 'No users found' });
    }

    // Success response
    res.status(200).json({
      'message': 'Users found',
      'users': users,
      'links': [
        {
          'rel': 'self',
          'type': 'POST',
          'href': 'http://127.0.0.1:3000/api/users/register',
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


router.get('/api/users/:id', auth, async function (req, res, next) {
  var id = req.params.id;
  try {

    // API versioning
    if (req.header('X-API-Version') !== 'v1') {
      return res.status(400).json({ 'message': 'API version not found' });
    }

    // Find user
    var user = await User.findById(id);
    if (user === null) {
      return res.status(404).json({ 'message': 'User not found' });
    }

    // Success response
    res.status(200).json({
      'message': 'User found',
      'user': user,
      'links': [
        {
          'rel': 'self',
          'type': 'PUT',
          'href': 'http://127.0.0.1:3000/api/users/' + user._id,
        },
        {
          'rel': 'self',
          'type': 'PATCH',
          'href': 'http://127.0.0.1:3000/api/users/' + user._id,
        },
        {
          'rel': 'self',
          'type': 'DELETE',
          'href': 'http://127.0.0.1:3000/api/users/' + user._id,
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


router.get('/api/users/:user_id/teams', auth, async function (req, res, next) {
  var user_id = req.params.user_id;
  try {

    // API versioning
    if (req.header('X-API-Version') !== 'v1') {
      return res.status(400).json({ 'message': 'API version not found' });
    }

    // Find user
    var user = await User.findById(user_id);
    if (user === null) {
      return res.status(404).json({ 'message': 'User not found' });
    }

    if (user.managedTeams.length === 0 && user.memberOfTeams.length === 0) {
      return res.status(404).json({ 'message': 'No teams found' });
    }

    // Success response
    res.status(200).json({
      'message': 'Teams found',
      'id': user._id,
      'managedTeams': user.managedTeams,
      'memberOfTeams': user.memberOfTeams,
      'links': [
        // add team links
      ]
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      'error': err
    });
  }
});


router.put('/api/users/:id', auth, async function (req, res, next) {
  var id = req.params.id;
  try {

    // API versioning
    if (req.header('X-API-Version') !== 'v1') {
      return res.status(400).json({ 'message': 'API version not found' });
    }

    // Find user
    var user = await User.findById(id);
    if (user === null) {
      return res.status(404).json({ 'message': 'User not found' });
    }

    if (!req.body.username) {
      return res.status(404).json({ 'message': 'Username cannot be empty' });
    }

    if (!req.body.password) {
      return res.status(404).json({ 'message': 'Password cannot be empty' });
    }

    if (!req.body.name) {
      return res.status(404).json({ 'message': 'Name cannot be empty' });
    }

    //Check for existing username
    const usernames = await User.find({ username: req.body.username }).exec();
    if (usernames.length >= 1) {
      return res.status(409).json({ 'message': 'Username already exists' });
    }

    // Update user info
    const hash = await bcrypt.hash(req.body.password, 10);
    user.username = req.body.username;
    user.password = hash;
    user.name = req.body.name;
    await user.save();

    // Success response
    res.status(200).json({
      'message': 'User has been updated',
      'id': user._id,
      'links': [
        {
          'rel': 'self',
          'type': 'GET',
          'href': 'http://127.0.0.1:3000/api/users/' + user._id,
        },
        {
          'rel': 'self',
          'type': 'PATCH',
          'href': 'http://127.0.0.1:3000/api/users/' + user._id,
        },
        {
          'rel': 'self',
          'type': 'DELETE',
          'href': 'http://127.0.0.1:3000/api/users/' + user._id,
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


router.patch('/api/users/:id', auth, async function (req, res, next) {
  var id = req.params.id;
  try {

    // API versioning
    if (req.header('X-API-Version') !== 'v1') {
      return res.status(400).json({ 'message': 'API version not found' });
    }

    // Find user by id
    var user = await User.findById(id);
    if (user === null) {
      return res.status(404).json({ 'message': 'User not found' });
    }

    // Check for existing username and change username
    if (req.body.username) {
      const usernames = await User.find({ username: req.body.username }).exec();
      if (usernames.length >= 1) {
        return res.status(409).json({ 'message': 'Username already exists' });
      }
      user.username = req.body.username;
    }

    // Change password
    if (req.body.password) {
      const hash = await bcrypt.hash(req.body.password, 10);
      user.password = hash;
    }

    // Change name
    if (req.body.name) {
      user.name = req.body.name;
    }

    await user.save();

    // Success response
    res.status(200).json({
      'message': 'User has been updated',
      'id': user._id,
      'links': [
        {
          'rel': 'self',
          'type': 'GET',
          'href': 'http://127.0.0.1:3000/api/users/' + user._id,
        },
        {
          'rel': 'self',
          'type': 'PUT',
          'href': 'http://127.0.0.1:3000/api/users/' + user._id,
        },
        {
          'rel': 'self',
          'type': 'DELETE',
          'href': 'http://127.0.0.1:3000/api/users/' + user._id,
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


router.delete('/api/users/:id', auth, async function (req, res, next) {
  var id = req.params.id;
  try {

    // API versioning
    if (req.header('X-API-Version') !== 'v1') {
      return res.status(400).json({ 'message': 'API version not found' });
    }

    // Find and delete user
    const user = await User.findOneAndDelete({ _id: id });
    if (user === null) {
      return res.status(404).json({ 'message': 'User not found' });
    }

    // Delete user's teams
    Team.deleteMany({ '_id': { $in: user.managedTeams } });

    // End session
    await req.session.destroy();

    // Success response
    res.status(200).json({
      'message': 'User deleted',
      'links': {
        'rel': 'self',
        'type': 'POST',
        'href': 'http://127.0.0.1:3000/api/users/register',
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