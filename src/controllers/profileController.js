const { connectDB } = require('../config/db');
const { ObjectId } = require('mongodb');

exports.getProfile = async (req, res) => {
    const id = req.params.id;
    try {
        const db = await connectDB();
        const profilesCollection = db.collection('Profiles');

        const user = await db.collection('Users').findOne({ _id: new ObjectId(id) });
        let userProfile = await profilesCollection.findOne({ userId: id });
        if ((!userProfile) && (user)){
            const newProfile = {
                userId: id,
                profileImage: "",
                bio: "",
                location: "",
                phone: "",
                email: "",
                currency: "Dollar",
                language: "en",
                isSet: true
            };
            profilesCollection.insertOne(newProfile);
            userProfile = newProfile;
        }

        if (!user){
            return res.status(406).json({ message: 'User profile does not exist' });
        }

        res.status(200).json(userProfile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Failed to fetch profile', error });
    }
};

exports.updateProfile = async (req, res) => {
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
            return res.status(406).json({ message: 'Profile not found' });
        }

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Failed to update profile', error });
    }
};