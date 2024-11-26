const express = require('express');
const router = express.Router();
const { connectDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const authMiddleware = require('../middleware/authMiddleware');
const {
    addProfile,
    getProfile,
    updateProfile,
    deleteProfile
  } = require('../controllers/profileController'); // Імпорт контролерів профілю
  
  // Захищені маршрути для профілів
  router.post('/', authMiddleware, addProfile); // Додавання профілю
  router.get('/:id', authMiddleware, getProfile); // Отримання профілю за ID
  router.put('/:id', authMiddleware, updateProfile); // Оновлення профілю
  router.delete('/:id', authMiddleware, deleteProfile); // Видалення профілю

router.get('/', authMiddleware, async (req, res) => {
    try {
        const db = await connectDB();
        const profilesCollection = db.collection('Profiles');

        const profiles = await profilesCollection.find().toArray();
        res.status(200).json(profiles);
    } catch (error) {
        console.error('Error fetching profiles:', error);
        res.status(500).json({ message: 'Failed to fetch profiles', error });
    }
});

router.get('/:id', authMiddleware, async (req, res) => {
    const id = req.params.id;
    try {
        const db = await connectDB();
        const profilesCollection = db.collection('Profiles');

        const userProfile = await profilesCollection.findOne({ userId: id });
        if (!userProfile) {
            return res.status(404).json({ message: 'User profile does not exist' });
        }

        res.status(200).json(userProfile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Failed to fetch profile', error });
    }
});

router.post('/', authMiddleware, async (req, res) => {
    try {
        const db = await connectDB();
        const profilesCollection = db.collection('Profiles');

        const { userId, profileImage, bio, location, phone, email, currency, language, isSet } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'userId is required' });
        }

        const newProfile = {
            userId,
            profileImage: profileImage || "",
            bio: bio || "",
            location: location || "",
            phone: phone || "",
            email: email || "",
            currency: currency || "USD",
            language: language || "en",
            isSet: isSet || false
        };

        const result = await profilesCollection.insertOne(newProfile);
        res.status(201).json({ message: 'Profile added successfully', profileId: result.insertedId });
    } catch (error) {
        console.error('Error adding profile:', error);
        res.status(500).json({ message: 'Failed to add profile', error });
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    const id = req.params.id;
    try {
        const db = await connectDB();
        const profilesCollection = db.collection('Profiles');

        const updates = { ...req.body };

        const result = await profilesCollection.updateOne(
            { userId: id },
            { $set: updates }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Failed to update profile', error });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    const id = req.params.id;
    try {
        const db = await connectDB();
        const profilesCollection = db.collection('Profiles');

        const result = await profilesCollection.deleteOne({ userId: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.status(200).json({ message: 'Profile deleted successfully' });
    } catch (error) {
        console.error('Error deleting profile:', error);
        res.status(500).json({ message: 'Failed to delete profile', error });
    }
});

module.exports = router;
