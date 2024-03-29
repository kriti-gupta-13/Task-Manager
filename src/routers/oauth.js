const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const express = require('express') 
const router = new express.Router()
const User = require('../models/user')
const emails = require('../emails/accounts')



passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
      done(null, user);
});

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {

  try {
    // Check if the user already exists in your database based on their Google ID
    const existingUser = await User.findOne({ mail: profile.emails[0].value });

    if (existingUser) {
      const token = await existingUser.generateAuthToken()
      return done(null, existingUser);
    }

    // If the user doesn't exist, create a new user in your database
    const user = await new User({
      googleId: profile.id,
      name: profile.displayName,
      mail: profile.emails[0].value,
      // can user login without google now since no password here 
    }).save();
    emails.sendWelcomeMail(user.mail,user.name)
    const token = await user.generateAuthToken()
    //res.status(201).send({user, token})
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}
));


router.get('/auth/google', passport.authenticate('google', {
  scope:['email', 'profile']
      }
  ));

router.get("/failed", (req, res) => {
  res.send("Failed")
})



/// Callback route for Google OAuth
// in success function, get the user info and add cookie to the response
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
function(req, res) {
    // Successful authentication, redirect home.
    res.cookie('task-manager-token', req.user.tokens[0].token).redirect('/')
}
);

module.exports = router