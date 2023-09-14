var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Team = require('../models/team');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');

router.post('/api/users/register', async function (req, res, next) {
  try {
    const username = await User.find({ username: req.body.username }).exec();
    if (username.length >= 1) {
      return res.status(409).json({
        message: "Username already exists"
      });
    } else {
      const hash = await bcrypt.hash(req.body.password, 10);
      const user = new User({
        username: req.body.username,
        password: hash,
        name: req.body.name
      });
      const newUser = await user.save();
      req.session.user = user;
      res.status(201).json({
        message: 'Registration successful',
        user: newUser,
        links: [{
          rel: "self",
          type: 'PATCH',
          hrel: "http://127.0.0.1:3000/users/" + newUser._id,
        }, {
          rel: "self",
          type: 'GET',
          hrel: "http://127.0.0.1:3000/users/" + newUser._id,
        }, {
          rel: "self",
          type: 'DELETE',
          hrel: "http://127.0.0.1:3000/users/" + newUser._id,
        }]
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
      message: 'Registration failed'
    });
  }
});

router.post('/api/users/login', async function (req, res, next) {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).exec();
    if (!user) {
      return res.status(401).json({ message: 'Log-in failed' });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Log-in failed' });
    }
    req.session.user = user;
    res.status(200).json({
      message: 'Log-in successful',
      user: user,
      links: [{
        rel: "self",
        type: 'PATCH',
        hrel: "http://127.0.0.1:3000/users/" + user._id,
      }, {
        rel: "self",
        type: 'GET',
        hrel: "http://127.0.0.1:3000/users/" + user._id,
      }, {
        rel: "self",
        type: 'DELETE',
        hrel: "http://127.0.0.1:3000/users/" + user._id,
      }]
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err, message: 'Log-in failed' });
  }
});

router.get('/api/users/:id', auth, async function (req, res, next) {
  var id = req.params.id;
  try {
    var user = await User.findById(id);
    if (user === null) {
      return res.status(404).json({ 'message': 'User not found!' });
    }
    res.status(200).json({
      username: user.username,
      id: user._id,
      name: user.name,
      teams: user.teams,
      link: [
        {
          rel: "self",
          type: 'PATCH',
          hrel: "http://127.0.0.1:3000/users/" + user._id,
        },
        {
          rel: "self",
          type: 'DELETE',
          hrel: 'http://127.0.0.1:3000/users/' + user._id,
        }
      ]
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err
    });
  }
});




router.delete('/api/users/:id', auth, async function (req, res, next) {
  var id = req.params.id;
  try {
    const user = await User.findOneAndDelete({ _id: id });
    if (user === null) {
      return res.status(404).json({ 'message': 'User not found' });
    }
    Team.deleteMany({ "_id":{ $in: user.teams} });
    await req.session.destroy();
    res.status(200).json({
      message: 'User deleted',
      link: {
        rel: "self",
        type: 'POST',
        hrel: 'http://127.0.0.1:3000/api/users/register',
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err
    });
  }
});


app.get('/logout', async function (req, res, next) {
  try {
    await req.session.destroy();
    res.status(204);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err
    });
  }
});


module.exports = router;