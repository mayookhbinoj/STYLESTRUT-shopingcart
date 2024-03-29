const passport=require("passport")
const facebookStrategy = require('passport-facebook').Strategy;
const facebook_client_id='394340166866048'
const facebook_secret='53e57aa67edb60a2971a662691c6d02a'
passport.use(new facebookStrategy({
    clientID: facebook_client_id,
    clientSecret: facebook_secret,
    callbackURL: "http://localhost:3001/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
       console.log(profile);
      return done(null, profile);
   
  }
))
passport.serializeUser((user,done)=>{
    done(null,user)
})
    

passport.deserializeUser((user,done)=>{
    done(null,user)
})
    