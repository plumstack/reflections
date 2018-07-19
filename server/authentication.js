const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy; // eslint-disable-line
const dotenv = require('dotenv'); //eslint-disable-line

const Database = require('./database/index');


module.exports = (app) => {
  const {
    GOOGLE_CLIENT_ID: clientID,
    GOOGLE_CLIENT_SECRET: clientSecret,
    GOOGLE_CALLBACK_URL: callbackURL,
    SECRET: secret,
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
        const RETRIEVED_USER = await Database.userVerify({
          id, accessToken, refreshToken,
        });
        cb(null, RETRIEVED_USER);
      } catch (error) {
        cb(error, null);
      }
    },
  ));

  app.get('/api/auth/checkAuth', async (req, res) => {
    const { sessionID } = req;

    try {
      const sessionCheckResult = await Database.verifySession(sessionID);
      return res.send({ loggedIn: sessionCheckResult });
    } catch (error) {
      throw new Error(error);
    }
  });

  app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile'] }));
  app.get('/api/auth/google/callback', passport.authenticate('google', {
    failureRedirect: 'http://localhost:8080/#/failedLogin',
  }), async (req, res) => {
    const { sessionID } = req;
    const { user } = req.session.passport;

    try {
      await Database.addSessionID({ user, sessionID });
    } catch (error) {
      throw new Error(error);
    }

    res.redirect('http://localhost:8080/#/home');
  });
};
