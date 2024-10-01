import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import dotenv from 'dotenv'

dotenv.config()

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.HOST}:${process.env.PORT}/api/auth/google/callback`|| 'http://localhost:4000/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id, emails, displayName } = profile;
      const email = emails[0].value.toLowerCase();
      const [name, ...surnameParts] = displayName.split(' ');
      const surname = surnameParts.join(' ');

      try {
        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            name,
            surname,
            email,
            googleID: id,
          });
        }

        const token = generateToken(user);
        done(null, { user, token });
      } catch (error) {
        done(error, null);
      }
    }
  )
);

export default passport;
