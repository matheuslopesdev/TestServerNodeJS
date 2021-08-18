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
router.patch('/:login', async (req, res) => {
    if(req.body && req.params.login) {
        const response = await UserService.getInstance().updateUser(req.params.login, req.body);
        res.status(response.success ? 200 : 400);
        return res.send(response);
    }

    res.status(400);
    return res.send(new Result(false, 'Empty body or missing login!'));
});

/* Delete user info */
router.delete('/:login', async (req, res) => {
    if(req.params.login) {
        const response = await UserService.getInstance().deleteUser(req.params.login);
        res.status(response.success ? 200 : 400);
        return res.send(response);
    }

    res.status(400);
    return res.send(new Result(false, 'Missing login!'));
});

export default router;
