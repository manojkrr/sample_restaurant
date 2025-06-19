/* eslint-disable consistent-return */
/* eslint-disable comma-dangle */
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcryptjs');

const Users = require('../models/users.model');

const isValidPassword = async (incomingPassword, user) => {
  const compare = await bcrypt.compare(incomingPassword, user.password);
  return compare;
};

passport.use(
  'signup',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    // eslint-disable-next-line consistent-return
    async (email, password, done) => {
      try {
        const hash = await bcrypt.hash(password, 10);
        const user = await Users.create({ email, password: hash });

        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await Users.findOne({ email });

        if (!user) {
          return done(null, false, { message: 'User not found' });
        }
        // we are calling the method defined for user schema
        // const validate = await user.isValidPassword(password);
        const validate = await isValidPassword(password, user);

        if (!validate) {
          return done(null, false, {
            message: 'Invalid username or password!',
          });
        }

        return done(null, user, { message: 'Logged in Successfully' });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  'jwt',
  new JWTstrategy(
    {
      secretOrKey: process.env.SECRET_TOKEN,
      //   jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token'),
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);
