 const passport=require("passport")
 const User=require("./models/userModel")
 const jwt=require("jsonwebtoken")
 const createToken = (user)=>{
    const JWT_SECRET = process.env.JWT_SECRET
    return jwt.sign(user,JWT_SECRET,{expiresIn:"1h"})
  
  }
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const Google_client_id='829054176119-bmpdf1dli58ie72qqhs9789h4fp0otoe.apps.googleusercontent.com'
const Google_secret="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"
passport.use(new GoogleStrategy({
    clientID: Google_client_id,
    clientSecret: Google_secret,
    callbackURL: "http://localhost:3001/google/callback"
  },
  

  
  async function(req,accessToken, refreshToken, profile, done) {
    try {
        let newuser = await User.findOne({ email: profile.email });
        console.log(profile);
  
        if (! newuser) {
          // If the user doesn't exist, create a new one
      newuser = new User({
            googleId: profile.id,
            email: profile.email,
            name:profile.displayName
            // other relevant fields
          });
          await newuser.save();
        }
  
        // Update the user's access token and refresh token
        newuser.googleAccessToken = accessToken;
        newuser.googleRefreshToken = refreshToken;
        await newuser.save();  
        // Create JWT token
        const token = createToken({ id: newuser._id }); // Assuming you have a function createToken to generate tokens
  
        // Set token as cookie
        req.cookie("jwt", token, {
          httpOnly: true,
          maxAge: 600000000, // Example expiration time, adjust as needed
          // Other cookie options as needed, such as secure: true for HTTPS only
        });
  
  
        return done(null,  newuser);
      } catch (error) {
        return done(error);
      }
    }

     
   
 
))
passport.serializeUser((user,done)=>{
    done(null,user)
})
    

passport.deserializeUser((user,done)=>{
    done(null,user)
})
    
