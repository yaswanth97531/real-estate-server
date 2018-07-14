const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');

const keys = require('./keys');
const User = require('./../models/user');

passport.serializeUser((user, done) => {
  done(null,user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null,user);
  });
});

passport.use(
  new GoogleStrategy({
  // options for the google start
    callbackURL:'/auth/google/redirect',
    clientID: keys.google.clientID,
    clientScrect: keys.google.clientSecret
  }, (accessToken, refreshToken, profile, done) => {
    // check if user already exists in our db
    User.findOne({googleId: profile.id}).then((currentUser) => {
      if(currentUser){
        // already have an user
        done(null, currentUser)
      } else{
        // creating a new user
        new User({
          username: profile.displayName,
          googleId: profile.id
        }).save().then((newUser) => {
          done(null, newUser);
        });
      } 
    });
}) 
)