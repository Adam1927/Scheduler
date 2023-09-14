var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Team = require('../models/team');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');

router.post('/api/users/register', async function (req, res, next) {
  try {
    if (req.apiVersion !== '1') {
      return res.status(400).json({ 'message': 'API version not found' })
    }
    const usernames = await User.find({ username: req.body.username }).exec();
    if (usernames.length >= 1) {
      return res.status(409).json({
        'message': 'Username already exists'
      });
    } else {
      const hash = await bcrypt.hash(req.body.password, 10);
      const user = new User({
        username: req.body.username,
        password: hash,
        name: req.body.name
      });
      await user.save();
      req.session.user = user;
      res.status(201).json({
        'message': 'Registration successful',
        'username': user.username,
      'id': user._id,
      'name': user.name,
      'teams': user.teams,
        'links': [{
          'rel': 'self',
          'type': 'PUT',
          'href': 'http://127.0.0.1:3000/users/' + user._id,
        }, {
          'rel': 'self',
          'type': 'PATCH',
          'href': 'http://127.0.0.1:3000/users/' + user._id,
        }, {
          'rel': 'self',
          'type': 'GET',
          'href': 'http://127.0.0.1:3000/users/' + user._id,
        }, {
          'rel': 'self',
          'type': 'DELETE',
          'href': 'http://127.0.0.1:3000/users/' + user._id,
        }]
      });
    }
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
    if (req.apiVersion !== '1') {
      return res.status(400).json({ 'message': 'API version not found' })
    }
    const { username, password } = req.body;
    const user = await User.findOne({ username }).exec();
    if (!user) {
      return res.status(401).json({ 'message': 'Log-in failed' });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ 'message': 'Log-in failed' });
    }
    req.session.user = user;
    res.status(200).json({
      'message': 'Log-in successful',
      'username': user.username,
      'id': user._id,
      'name': user.name,
      'teams': user.teams,
      'links': [{
        'rel': 'self',
        'type': 'PUT',
        'href': 'http://127.0.0.1:3000/users/' + user._id,
      }, {
        'rel': 'self',
        'type': 'PATCH',
        'href': 'http://127.0.0.1:3000/users/' + user._id,
      }, {
        'rel': 'self',
        'type': 'GET',
        'href': 'http://127.0.0.1:3000/users/' + user._id,
      }, {
        'rel': 'self',
        'type': 'DELETE',
        'href': 'http://127.0.0.1:3000/users/' + user._id,
      }]
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ 'error': err, 'message': 'Log-in failed' });
  }
});

router.get('/api/users/:id', auth, async function (req, res, next) {
  var id = req.params.id;
  try {
    if (req.apiVersion !== '1') {
      return res.status(400).json({ 'message': 'API version not found' })
    }
    var user = await User.findById(id);
    if (user === null) {
      return res.status(404).json({ 'message': 'User not found' });
    }
    res.status(200).json({
      'message': 'User found',
      'username': user.username,
      'id': user._id,
      'name': user.name,
      'teams': user.teams,
      'link': [
        {
          'rel': 'self',
          'type': 'PUT',
          'href': 'http://127.0.0.1:3000/users/' + user._id,
        },
        {
          'rel': 'self',
          'type': 'PATCH',
          'href': 'http://127.0.0.1:3000/users/' + user._id,
        },
        {
          'rel': 'self',
          'type': 'DELETE',
          'href': 'http://127.0.0.1:3000/users/' + user._id,
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

router.put('/api/users/:id', auth, async function (req, res, next) {
  var id = req.params.id;
  try {
    if (req.apiVersion !== '1') {
      return res.status(400).json({ 'message': 'API version not found' })
    }
    var user = await User.findById(id);
    if (user === null) {
      return res.status(404).json({ 'message': 'User not found' });
    }
    if (!req.body.username) {
      return res.status(404).json({ 'message': 'Username cannot be empty' });
    }
    const usernames = await User.find({ username: req.body.username }).exec();
    if (usernames.length >= 1) {
      return res.status(409).json({
        'message': 'Username already exists'
      });
    }
    if (!req.body.password) {
      return res.status(404).json({ 'message': 'Password cannot be empty' });
    }
    if (!req.body.name) {
      return res.status(404).json({ 'message': 'Name cannot be empty' });
    }
    const hash = await bcrypt.hash(req.body.password, 10);
    user.username = req.body.username;
    user.password = hash;
    user.name = req.body.name;
    await user.save();
    res.status(200).json({
      'message': 'User has been updated',
      'username': user.username,
      'id': user._id,
      'name': user.name,
      'teams': user.teams,
      'link': [
        {
          'rel': 'self',
          'type': 'GET',
          'href': 'http://127.0.0.1:3000/users/' + user._id,
        },
        {
          'rel': 'self',
          'type': 'PATCH',
          'href': 'http://127.0.0.1:3000/users/' + user._id,
        },
        {
          'rel': 'self',
          'type': 'DELETE',
          'href': 'http://127.0.0.1:3000/users/' + user._id,
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
    if (req.apiVersion !== '1') {
      return res.status(400).json({ 'message': 'API version not found' })
    }
    var user = await User.findById(id);
    if (user === null) {
      return res.status(404).json({ 'message': 'User not found' });
    }
    if (req.body.username) {
      const usernames = await User.find({ username: req.body.username }).exec();
      if (usernames.length >= 1) {
        return res.status(409).json({
          'message': 'Username already exists'
        });
      }
      user.username = req.body.username;
    }
    if (req.body.password) {
      const hash = await bcrypt.hash(req.body.password, 10);
      user.password = hash;
    }

    if (req.body.name) {
      user.name = req.body.name;
    }
    
    await user.save();
    res.status(200).json({
      'message': 'User has been updated',
      'username': user.username,
      'id': user._id,
      'name': user.name,
      'teams': user.teams,
      'link': [
        {
          'rel': 'self',
          'type': 'GET',
          'href': 'http://127.0.0.1:3000/users/' + user._id,
        },
        {
          'rel': 'self',
          'type': 'PUT',
          'href': 'http://127.0.0.1:3000/users/' + user._id,
        },
        {
          'rel': 'self',
          'type': 'DELETE',
          'href': 'http://127.0.0.1:3000/users/' + user._id,
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
    if (req.apiVersion !== '1') {
      return res.status(400).json({ 'message': 'API version not found' })
    }
    const user = await User.findOneAndDelete({ _id: id });
    if (user === null) {
      return res.status(404).json({ 'message': 'User not found' });
    }
    Team.deleteMany({ '_id': { $in: user.teams } });
    await req.session.destroy();
    res.status(200).json({
      'message': 'User deleted',
      'link': {
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


router.get('/logout', async function (req, res, next) {
  try {
    if (req.apiVersion !== '1') {
      return res.status(400).json({ 'message': 'API version not found' })
    }
    await req.session.destroy();
    res.status(204);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      'error': err
    });
  }
});


module.exports = router;