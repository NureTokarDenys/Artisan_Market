const express = require('express');
const router = express.Router();
const readFile = require('../data/readData');
const writeFile = require('../data/writeData');
const authMiddleware = require('../middleware/authMiddleware');

// Тимчасовий масив для зберігання профілів
const PROFILES_PATH = './src/data/profiles.json';
let profiles = readFile(PROFILES_PATH);

const USERS_PATH = './src/data/users.json';
let users = readFile(USERS_PATH);

router.post('/update', authMiddleware, (req, res) => {
    try {
        const { user, image, bio, location, phone, email } = req.body;

        profiles = profiles.filter((profile) => profile.userId !== user.id);

        const profile = { userId: user.id, image, bio, location, phone, email };
        profiles.push(profile);
        writeFile(PROFILES_PATH, profiles);

    } catch (error) {
        console.error('Error in updateProfile:', error);
        res.status(500).json({ message: 'Server error', error });
      }
});

router.get('/:id', authMiddleware, (req, res) => {
    const id = req.params.id;
    const userProfile = profiles.find((profile) => profile.userId == id);
    const user = users.find((user) => user.id == id);
    if(!userProfile) {
        if(user){
            const profile = { userId: user.id, image: "", bio: "", location: "", phone: "", email: "" };
            profiles.push(profile);
            writeFile(PROFILES_PATH, profiles);
            return res.status(200).json(profile);
        }
        return res.status(400).json({ message: 'User profile does not exist' });
    }
    res.status(200).json(userProfile);
});

module.exports = router;