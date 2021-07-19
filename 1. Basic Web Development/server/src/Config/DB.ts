import mongoose from 'mongoose';

export const connectDB = async () => {
    const conn = await mongoose.connect("mongodb+srv://Sebastian:Sebastian123@sporebase.whcyb.mongodb.net/BasicWebDev?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: true,
        useUnifiedTopology: true
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
}