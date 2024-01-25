const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
        done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: '60292068134-216d6v5aeld8b9c8s19b0cevc1785baa.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:3000/users/google/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    // Check if the user already exists in your database based on profile.id or other information
    // If not, create a new user entry
    // Save user information in the session or your user database
    // Call done(null, user) to indicate successful authentication
    // For example:
    // const user = { id: profile.id, email: profile.emails[0].value, displayName: profile.displayName };
    done(null, profile)
  }
));

