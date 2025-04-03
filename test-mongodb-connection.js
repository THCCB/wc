import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get MongoDB connection string from environment variable
const MONGODB_URI = 'mongodb+srv://cbvcroom6:fA0ZkeAFIzmIj7mB@cluster0.ctiutem.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function testMongoDBConnection() {
    try {
        console.log('Attempting to connect to MongoDB at:', MONGODB_URI);
        
        await mongoose.connect(MONGODB_URI);
        console.log('Successfully connected to MongoDB!');
        
        // Test query to check if we can access the submissions collection
        const count = await mongoose.connection.db.collection('submissions').countDocuments();
        console.log('Number of submissions in MongoDB:', count);
        
        // Close the connection
        await mongoose.connection.close();
        console.log('MongoDB connection closed.');
        
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        if (error.name === 'MongoServerSelectionError') {
            console.error('Could not connect to MongoDB server. Please check:');
            console.error('1. MongoDB server is running');
            console.error('2. MONGODB_URI environment variable is correctly set');
            console.error('3. Network connectivity and firewall settings');
        }
        process.exit(1);
    }
}

testMongoDBConnection();