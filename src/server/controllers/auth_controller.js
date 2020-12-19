const User = require('../models/User');
const passport = require('passport');

const userLogin = (req, res) => {
  passport.authenticate('local', {
    successRedirect: '/success',
    failureRedirect: '/'
  })
}

const userLogout = (req, res) => {
  req.logout();
}

const registerNew = (req, res) => {
  const { email, password, name, nickname, is_artist, contact, link } = req.body

  new User({email:email, password:password, name:name, nickname:nickname, is_artist:is_artist, contact:contact, link:link}).save((err, user) => {
    if (err) {
      res.status(500);
      return res.json({
        error: err.message
      })
    } else {
      userLogin(req,res)
    }
  })
}

module.exports = {
  registerNew,
  userLogin,
  userLogout
}