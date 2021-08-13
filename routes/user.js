import express from 'express';
import UserService from '../services/userService.js';

var router = express.Router();

/* GET users listing. */
router.get('/:login', async (req, res) => {
    //TODO: VALIDATE INPUT AND use result class
    return res.send(await UserService.getUserByLogin(req.params.login));
});

router.post('/', async (req, res) => {
    if(req.body) {
        const response = await new UserService().createUser(req.body);
        res.status(response.success ? 200 : 400);
        return res.send(response);
    }
    
    //TODO: use result class
    return res.send('Empty body');
});

router.put('/', async (req, res) => {
    return res.send('respond with a resource');
});

export default router;
