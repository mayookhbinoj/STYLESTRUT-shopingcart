 const passport=require("passport")

 const jwt=require("jsonwebtoken")
 const createToken = (user)=>{
    const JWT_SECRET = process.env.JWT_SECRET
    return jwt.sign(user,JWT_SECRET,{expiresIn:"1h"})
  
  }
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const Google_client_id=process.env.Google_client_id
const Google_secret=process.env.Google_secret
passport.use(new GoogleStrategy({
    clientID: Google_client_id,
    clientSecret: Google_secret,
    callbackURL: "http://localhost:3001/google/callback"
  },
  

  
  function(request, accessToken, refreshToken, profile, done) {
    
    return done(null, profile);
  }

));


passport.serializeUser((user,done)=>{
    done(null,user)
})
    

passport.deserializeUser((user,done)=>{
    done(null,user)
})
    
