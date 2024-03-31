const express = require('express');
const passport = require('passport');
const User = require('../models/UserModel');
const GitHubStrategy = require('passport-github').Strategy;
const config = require('../config');

const authRouter = express.Router();


passport.use(new GitHubStrategy({
  clientID: config.githubClientID,
  clientSecret: config.githubClientSecret,
  callbackURL: `http://localhost:${config.port}/auth/github/callback`
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      
      let user = await User.findOne({ githubId: profile.id });
      if (!user) {
        user = new User({
          githubId: profile.id,
          email: profile.emails[0].value,
          first_name: profile.displayName.split(' ')[0],
          last_name: profile.displayName.split(' ')[1]
        });
        await user.save();
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));


authRouter.get('/github', passport.authenticate('github'));


authRouter.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/productos'); 
  }
);

module.exports = authRouter;