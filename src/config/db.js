const mongoose = require('mongoose');

const mongoConnect = async () => {
    try {
       await mongoose.connect(process.env.MONGO_URL);
       console.log('Mongoose connected');
    } catch (error) {
        console.log('Failed to connect', error);
    }
}

module.exports = mongoConnect;