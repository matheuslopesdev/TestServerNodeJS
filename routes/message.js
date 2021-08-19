import express from 'express';
import Passport from 'passport';

import MessageService from '../services/messageService.js';

var router = express.Router();

router.post('/', Passport.authenticate('jwt', { session: false }), async (req, res) => {
    if(req.body) {
        const response = await MessageService.getInstance().postMessage(req.body);
        res.status(response.success ? 200 : 400);
        return res.send(response);
    }

    res.status(400);
    return res.send(new Result(false, 'Empty body!'));
});

router.put('/', async (req, res) => {
    res.send('respond with a resource');
});

export default router;
