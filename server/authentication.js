const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy; // eslint-disable-line
const dotenv = require('dotenv'); //eslint-disable-line

const DB = require('./database/index');

module.exports = (app) => {
  const {
    GOOGLE_CLIENT_ID: clientID,
    GOOGLE_CLIENT_SECRET: clientSecret,
    GOOGLE_CALLBACK_URL: callbackURL,
    SECRET: secret,
    BASE_URL,
  } = process.env;
  app.use(session({ secret, resave: false, saveUninitialized: false }));
  app.use(passport.initialize());
  app.use(passport.session());
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));


  passport.use(new GoogleStrategy(
    {
      clientID,
      clientSecret,
      callbackURL,
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const { id } = profile;
        const retrievedUser = await DB.User.userVerify({
          id, accessToken, refreshToken,
        });
        cb(null, retrievedUser);
      } catch (error) {
        cb(error, null);
      }
    },
  ));

  app.get(`${BASE_URL}api/auth/checkAuth`, async (req, res) => {
    const { sessionID } = req;

    try {
      const sessionCheckResult = await DB.User.verifySession(sessionID);
      return res.send({ loggedIn: sessionCheckResult });
    } catch (error) {
      throw new Error(error);
    }
  });

  app.get(`${BASE_URL}api/auth/google`, passport.authenticate('google', { scope: ['profile'] }));
  app.get(`${BASE_URL}api/auth/google/callback`, passport.authenticate('google', {
    failureRedirect: 'http://localhost:8080/#/failedLogin',
  }), async (req, res) => {
    const { sessionID } = req;
    const { user } = req.session.passport;

    try {
      await DB.User.addSessionID({ user, sessionID });
    } catch (error) {
      throw new Error(error);
    }

    res.redirect('http://localhost:8080/#/');
  });
  app.post(`${BASE_URL}api/auth/logout`, (req) => req.session.destroy());
};
