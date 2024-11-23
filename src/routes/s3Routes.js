const express = require('express');
const router = express.Router();
const generateUploadURL = require('../options/AWS_s3Options');

router.get('/url', async (req, res) => {
    const url = await generateUploadURL();
    res.send({url});
});

module.exports = router;