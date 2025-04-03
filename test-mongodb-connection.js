import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get MongoDB connection string from environment variable
const MONGODB_URI = 'mongodb+srv://cbvcroom6:fA0ZkeAFIzmIj7mB@cluster0.ctiutem.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// MongoDB connection options
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 45000,
    family: 4,
    retryWrites: true,
    w: 'majority',
    ssl: true,
    authSource: 'admin'
};

async function testMongoDBConnection() {
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('Connection string format check:', MONGODB_URI.startsWith('mongodb+srv://'));
        
        await mongoose.connect(MONGODB_URI, options);
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
            console.error('1. MongoDB Atlas cluster is running and accessible');
            console.error('2. Your IP address is whitelisted in MongoDB Atlas Network Access settings');
            console.error('3. Connection string is correct and includes all necessary parameters');
            console.error('4. Network connectivity and firewall settings');
            console.error('\nDetailed error information:');
            console.error('Error name:', error.name);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
        }
        process.exit(1);
    }
}

testMongoDBConnection();