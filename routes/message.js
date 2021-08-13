import express from 'express';
import MessageService from '../services/messageService.js';

var router = express.Router();

router.post('/', async (req, res, next) => {
    //TODO: Validate if have message
    res.send('respond with a resource');
});

router.put('/', async (req, res, next) => {
    res.send('respond with a resource');
});

export default router;
