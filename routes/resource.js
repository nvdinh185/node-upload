const router = require('express').Router();

const handlers = require('../handlers/handler');

router.post('/file_upload', handlers.postFile);

module.exports = router;