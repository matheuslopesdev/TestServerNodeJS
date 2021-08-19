import express from 'express';
import Jwt from 'jsonwebtoken';
import Passport from 'passport';

import UserService from '../services/userService.js';
import Result from '../utils/result.js';

var router = express.Router();

/* Get user info */
router.get('/:login', Passport.authenticate('jwt', { session: false }), async (req, res) => {
    if(req.params.login) {
        const response = await UserService.getInstance().getUserByLogin(req.params.login);
        res.status(response.success ? 200 : 400);
        return res.send(response);
    }
    
    res.status(400);
    return res.send(new Result(false, 'Empty body!'));
});

/* Create new user */
router.post('/', Passport.authenticate('jwt', { session: false }), async (req, res) => {
    if(req.body) {
        const response = await UserService.getInstance().createUser(req.body);
        res.status(response.success ? 200 : 400);
        return res.send(response);
    }

    res.status(400);
    return res.send(new Result(false, 'Empty body!'));
});

/* Update user info */
router.patch('/:login', Passport.authenticate('jwt', { session: false }), async (req, res) => {
    if(req.body && req.params.login) {
        const response = await UserService.getInstance().updateUser(req.params.login, req.body);
        res.status(response.success ? 200 : 400);
        return res.send(response);
    }

    res.status(400);
    return res.send(new Result(false, 'Empty body or missing login!'));
});

/* Delete user info */
router.delete('/:login', Passport.authenticate('jwt', { session: false }), async (req, res) => {
    if(req.params.login) {
        const response = await UserService.getInstance().deleteUser(req.params.login);
        res.status(response.success ? 200 : 400);
        return res.send(response);
    }

    res.status(400);
    return res.send(new Result(false, 'Missing login!'));
});

/* User login */
router.post('/login', async (req, res, next) => {
    Passport.authenticate('login', async (error, user, info) => {
        try {
            if(error || !user) {
                return res.status(400).send(info?.message || error?.message || 'An Error occurred!');
            }
    
            req.login(user, { session: false }, async (error) => {
                if(error) {
                    return next(error);
                }

                const body = { _id: user._id, username: user.username };
                const token = Jwt.sign({ user: body }, process.env.JWT_KEY, { expiresIn: 30 });//expires in 30 secs

                return res.send({ token });
            })
        }
        catch(ex) {
            return next(ex);
        }
    })(req, res, next)
});

export default router;
