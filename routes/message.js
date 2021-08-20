import express from 'express';
import Passport from 'passport';
import Busboy from 'busboy';

import MessageService from '../services/messageService.js';
import Result from '../utils/result.js';

const router = express.Router();

router.post('/', Passport.authenticate('jwt', { session: false }), async (req, res) => {
    if(req.body) {
        const response = await MessageService.getInstance().postMessage(req.body);
        res.status(response.success ? 200 : 400);
        return res.send(response);
    }

    res.status(400);
    return res.send(new Result(false, 'Empty body!'));
});

// TODO: Improve code quality
router.post('/upload', Passport.authenticate('jwt', { session: false }), async (req, res) => {
    const busboy = new Busboy({ headers: req.headers,  });

    let uploadedFile = false;
    let login;
    let loginCheckInterval;
    let loginCheckCount = 0;

    busboy.on('file', async (fieldName, file, filename, encoding, mimetype) => {
        uploadedFile = true;

        if(mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            res.status(400);
            return res.send(new Result(false, 'Wrong file format, .xlsx only!'));
        }
        if(!login) {
            loginCheckInterval = setInterval(async () => {
                if(login) {
                    clearTimeout(loginCheckInterval);

                    const response = await MessageService.getInstance().postMessageBatch(file, login);
                    res.status(response.success ? 200 : 400);
                    return res.send(response);
                }
                else if(loginCheckCount > 10) {
                    clearTimeout(loginCheckInterval);
                    res.status(400);
                    return res.send(new Result(false, 'Login field is mandatory!'));
                }
                loginCheckCount++;
            }, 100);
        }
        else {
            const response = await MessageService.getInstance().postMessageBatch(file, login);
            res.status(response.success ? 200 : 400);
            return res.send(response);
        }
        
    });

    busboy.on('field', (fieldName, value, fieldNameTruncated, valueTruncated, encoding, mimetype) => {
        login = fieldName === 'login' ? value : login;
    });

    busboy.on('finish', () => {
        if(!uploadedFile) {
            res.status(400);
            return res.send(new Result(false, 'File is mandatory!'));
        }

        // return res.send();
    })

    return req.pipe(busboy);
});

export default router;
