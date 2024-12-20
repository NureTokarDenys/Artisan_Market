const { connectDB } = require('../config/db');
const { ObjectId } = require('mongodb');

// Create new orders (from buyers)
exports.createOrder = async (req, res) => {
    const userId = req.body.userId;
    const orderDetails = req.body.orderDetails; // []
    const delivery = req.body.delivery;
    const payment = req.body.payment;
    const totalPrice = req.body.totalPrice;
    try {
        const db = await connectDB();
        const user = await db.collection('Users').findOne({ _id: new ObjectId(userId) });
        if (!user){
            return res.status(404).json({ message: 'User does not exist' });
        }

        const createdAt = new Date().toISOString();

        const order = {
            userId: new ObjectId(userId),
            orderDetails: orderDetails,
            delivery: delivery,
            payment: payment,
            status: "In progress",
            totalPrice: parseFloat(totalPrice),
            createdAt: createdAt
        }

        const newOrder = await db.collection('Orders').insertOne(order);

        res.status(200).json({ insertedId: newOrder.insertedId, createdAt: createdAt, order: {...order, _id: newOrder.insertedId} });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Failed to create order', error });
    }
}

// Get all orders for a buyer
exports.getBuyerOrders = async (req, res) => {
    const id = req.params.id;
    try {
        const db = await connectDB();
        const user = await db.collection('Users').findOne({ _id: new ObjectId(id) });

        if (!user){
            return res.status(404).json({ message: 'User does not exist' });
        }

        const orders = await db.collection('Orders').find({ userId: new ObjectId(id) }).toArray();

        return res.status(200).json({ orders });

    } catch (error){
        console.error('Error getting orders of a buyer:', error);
        res.status(500).json({ message: 'Failed to get orders of a buyer', error });
    }

}

// Get all orders for a seller
exports.getSellerOrders = async (req, res) => {
  const id = req.params.id; 
  try {
      const db = await connectDB();
      const ordersCollection = db.collection('Orders');

      if (!ObjectId.isValid(id)) {
          return res.status(400).json({ message: 'Invalid userId format' });
      }

      const user = await db.collection('Users').findOne({ _id: new ObjectId(id) });
      if (!user) {
          return res.status(404).json({ message: 'User does not exist' });
      }

      // Aggregation pipeline
      const pipeline = [
          {
              $unwind: "$orderDetails" // Break down 'orderDetails' array into individual product documents
          },
          {
              $match: { "orderDetails.userId": id } // Filter products by seller ID
          },
          {
              $group: {
                  _id: {
                      orderId: "$_id", // Group by orderId (unique per order)
                      buyerId: "$userId" // Include buyer's userId
                  },
                  products: { $push: "$orderDetails" }, // Collect all products for this order
                  delivery: { $first: "$delivery" }, // Take delivery info from the order
                  payment: { $first: "$payment" }, // Take payment info from the order
                  createdAt: { $first: "$createdAt" }, // Take the order creation timestamp
                  status: { $first: "$status" }
              }
          },
          {
              $project: {
                  _id: 0,
                  orderId: "$_id.orderId", // Include orderId
                  buyerId: "$_id.buyerId", // Include buyerId
                  products: 1, 
                  delivery: 1,
                  payment: 1,
                  status: 1,
                  createdAt: 1
              }
          }
      ];

      const sellerOrders = await ordersCollection.aggregate(pipeline).toArray();

      res.status(200).json(sellerOrders);
  } catch (error) {
      console.error('Error getting orders of a seller:', error);
      res.status(500).json({ message: 'Failed to get orders of a seller', error: error.message });
  }
};



  // Order cancellation
    exports.changeOrderStatus = async (req, res) => {
        const orderId = req.params.id;
        const userId = req.user.id; 
    
        try {
            const status = req.body.status; 
        
            const db = await connectDB();
        
            const order = await db.collection('Orders').findOne({ _id: new ObjectId(orderId) });
        
            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }
        
            if (order.userId.toString() != userId) {
                return res.status(407).json({ error: 'You are not authorized to change the status of this order' });
            }
        
            const result = await db.collection('Orders').updateOne(
                { _id: new ObjectId(orderId) },
                { $set: { status } }
            );
        
            res.status(200).json({ message: 'Order status updated successfully', result });
        } catch (error) {
            console.error('Error changing order status:', error);
            res.status(500).json({ error: 'Failed to change status of the order' });
        }
    };
