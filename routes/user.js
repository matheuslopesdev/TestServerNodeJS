import express from 'express';
import UserService from '../services/userService.js';
import Result from '../utils/result.js';

var router = express.Router();

/* Get user info */
router.get('/:login', async (req, res) => {
    if(req.params.login) {
        const response = await UserService.getInstance().getUserByLogin(req.params.login);
        res.status(response.success ? 200 : 400);
        return res.send(response);
    }
    
    res.status(400);
    return res.send(new Result(false, 'Empty body!'));
});

/* Create new user */
router.post('/', async (req, res) => {
    if(req.body) {
        const response = await UserService.getInstance().createUser(req.body);
        res.status(response.success ? 200 : 400);
        return res.send(response);
    }

    res.status(400);
    return res.send(new Result(false, 'Empty body!'));
});

/* Update user info */
router.put('/:userId', async (req, res) => {
    if(req.body && req.params.userId) {
        const response = await UserService.getInstance().updateUser(req.params.userId, req.body);
        res.status(response.success ? 200 : 400);
        return res.send(response);
    }

    res.status(400);
    return res.send(new Result(false, 'Empty body or Id!'));
});

/* Delete user info */
router.delete('/', async (req, res) => {
    return res.send('respond with a resource');
});

export default router;
