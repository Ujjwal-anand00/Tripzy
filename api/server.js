import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import nodemailer from 'nodemailer';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const mongoURI = "mongodb+srv://ujjwal:UjjwalAnand@cluster0.swd3mg7.mongodb.net/"
mongoose.connect(mongoURI).then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log("Error connecting to MongoDB:", err);
    process.exit(1);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});