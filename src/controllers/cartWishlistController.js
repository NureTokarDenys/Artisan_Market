const { connectDB } = require('../config/db');
const { ObjectId } = require('mongodb');

exports.getCart = async (req, res) => {
    const id = req.params.id;
    try {
        const db = await connectDB();
        const cartsCollection = db.collection('Carts');

        const user = db.collection('Users').findOne({ _id: new ObjectId(id) });
        let userCart = await cartsCollection.findOne({ userId: id });
        if ((!userCart) && (user)){
            const newCart = {
                userId: id,
                cart: []
            };
            cartsCollection.insertOne(newCart);
            userCart = newCart;
        }

        if (!user){
            return res.status(406).json({ message: 'User profile does not exist' });
        }

        res.status(200).json(userCart);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Failed to fetch profile', error });
    }
};

exports.getWishlist = async (req, res) => {
    const id = req.params.id;
    try {
        const db = await connectDB();
        const wishlistsCollection = db.collection('Wishlists');

        const user = db.collection('Users').findOne({ _id: new ObjectId(id) });
        let userWishlist = await wishlistsCollection.findOne({ userId: id });
        if ((!userWishlist) && (user)){
            const newWishlist = {
                userId: id,
                wishlist: []
            };
            wishlistsCollection.insertOne(newWishlist);
            userWishlist = newWishlist;
        }

        if (!user){
            return res.status(406).json({ message: 'User profile does not exist' });
        }

        res.status(200).json(userWishlist);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Failed to fetch profile', error });
    }
};

exports.setCart = async (req, res) => {
    const id = req.params.id;

    try {
        const db = await connectDB();
        const cartsCollection = db.collection('Carts'); 

        const { cart } = req.body;


        if (!Array.isArray(cart)) {
            return res.status(400).json({ message: 'Invalid cart data' });
        }

        const result = await cartsCollection.updateOne(
            { userId: id },
            { $set: { cart } },
            { upsert: true } 
        );

        if (result.matchedCount === 0 && result.upsertedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Cart updated successfully' });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ message: 'Failed to update cart', error });
    }
};

exports.setWishlist = async (req, res) => {
    const id = req.params.id;

    try {
        const db = await connectDB();
        const wishlistCollection = db.collection('Wishlists'); 

        const { wishlist } = req.body;


        if (!Array.isArray(wishlist)) {
            return res.status(400).json({ message: 'Invalid wishlist data' });
        }

        const result = await wishlistCollection.updateOne(
            { userId: id },
            { $set: { wishlist } },
            { upsert: true } 
        );

        if (result.matchedCount === 0 && result.upsertedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Wishlist updated successfully' });
    } catch (error) {
        console.error('Error updating wishlist:', error);
        res.status(500).json({ message: 'Failed to update wishlist', error });
    }
};