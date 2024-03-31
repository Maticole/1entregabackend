require('dotenv').config();

const config = {
  port: process.env.PORT || 8080,
  mongodbURI: process.env.MONGODB_URI,
  sessionSecret: process.env.SESSION_SECRET,
  githubClientID: process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
};

module.exports = config;