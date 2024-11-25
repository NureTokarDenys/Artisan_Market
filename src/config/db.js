const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const uri = `mongodb+srv://admin:pzpi-22-1@artisianmarketdb.je5an.mongodb.net`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectDB() {
    try {
      console.log('Connecting to MongoDB...');
      await client.connect();
      console.log('Connected to MongoDB successfully');
      return client.db('ArtisianMarketDB');
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error.message);
      console.error('Full error details:', error);
      process.exit(1);
    }
  }
  

module.exports = { connectDB, client };
