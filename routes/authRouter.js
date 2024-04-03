const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');
const User = require('../models/UserModel');
const GitHubStrategy = require('passport-github').Strategy;
const config = require('../config');

const authRouter = express.Router();

passport.use(new GitHubStrategy({
  clientID: config.githubClientID,
  clientSecret: config.githubClientSecret,
  callbackURL: `http://localhost:${config.port}/auth/github/callback`
},
  authController.githubStrategyCallback
));

authRouter.get('/github', passport.authenticate('github'));
authRouter.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), authController.githubCallback);

module.exports = authRouter;