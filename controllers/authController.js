const User = require('../models/UserModel');

async function githubStrategyCallback(accessToken, refreshToken, profile, done) {
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

function githubCallback(req, res) {
  res.redirect('/productos');
}

module.exports = {
  githubStrategyCallback,
  githubCallback,
};