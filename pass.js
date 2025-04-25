const passport = require('passport');
const env = require('dotenv').config();
const GitHubStrategy = require('passport-github').Strategy;


passport.use(new GitHubStrategy({
    clientID:process.env.GITHUB_CLIENT_ID,
    clientSecret:process.env.GITHUB_CLIENT_SECRET,
    callbackURL:"http://localhost:3000/login/oauth2/code/github",
},

function (accessToken, refreshToken, profile, done){
    return done(null, profile);
}

));

passport.serializeUser(function(user, done){
    done(null, user);
})



passport.deserializeUser(function(obj, done){
    done(null, obj);
})
