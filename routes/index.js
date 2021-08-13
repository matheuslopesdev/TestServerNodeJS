import express from 'express';
var router = express.Router();

router.get('/', function(req, res, next) {
    return res.send('tests')
});

export default router;
