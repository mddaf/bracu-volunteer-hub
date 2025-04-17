/* eslint-disable no-undef */

const mongoose = require('mongoose');

const mongoURL = 'mongodb+srv://mddaf:A149810l@cluster0.8eiexmr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const mongoDB = async () => {
    try {
        await mongoose.connect(mongoURL);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
};

module.exports = mongoDB;
