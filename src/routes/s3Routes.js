const express = require('express');
const router = express.Router();
const generateUploadURL = require('../options/AWS_s3Options');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/url', authMiddleware, async (req, res) => {
    const url = await generateUploadURL();
    res.send({url});
});

module.exports = router;