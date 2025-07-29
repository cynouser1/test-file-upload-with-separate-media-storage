
import mongoose from 'mongoose';

const connection = {}
const connectDB = async () => {
    if (connection.isConnected) {
        // console.log('MongoDB already connected');
        return;
    }
    try {
        // const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/testfileuploaddb', 
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/testfileuploadwithseparatemediadb', 
        // {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true,
        // }
    );

        connection.isConnected = conn.connections[0].readyState;

        console.log('MongoDB connected : ', conn.connection.host);
        console.log("connection successfully");
    } catch (err) {
        // console.log("database connection failed ", err.message);
        console.error(err.message);
        process.exit(1);
    }
};

// module.exports = connectDB;
export default connectDB;
