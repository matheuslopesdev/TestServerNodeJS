import Passport from 'passport';
import PassportLocal from 'passport-local';
import PassportJwt from 'passport-jwt';

import UserModel from '../models/user.js';
import { handleError } from '../utils/utils.js';
import { logger } from '../config/logger.js';

const JwtStrategy = PassportJwt.Strategy;
const ExtractJwt = PassportJwt.ExtractJwt;

const LocalStrategy = PassportLocal.Strategy;

export default class Auth {
    async load() {
        Passport.use(
            'login',
            new LocalStrategy(async (username, password, done) => {
                try {
                    logger.debug(`Trying to log in ${username}`)
                    const user = await UserModel.findOne({ username });
        
                    if(!user) {
                        return done(null, false, { message: 'User not found' });
                    }
        
                    if(!await user.isValidPassword(password)) {
                        return done(null, false, { message: 'Wrong Password' });
                    }
        
                    logger.debug(`Logged in Successfully - ${username}`)
                    return done(null, user, { message: 'Logged in Successfully' });
                }
                catch(ex) {
                    console.error(ex)
                    handleError(ex, logger);
                    return done(ex);
                }
            })
        );
        
        Passport.use(new JwtStrategy(
            { 
                secretOrKey: process.env.JWT_KEY,
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                ignoreExpiration: false
            },
            async (token, done) => {
                try {

                    return done(null, token.user);
                } 
                catch (ex) {
                    done(ex);
                }
            })
        )
    }
}