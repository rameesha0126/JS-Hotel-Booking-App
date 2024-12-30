import express, { urlencoded } from "express";
import 'dotenv/config';
import connectDB from "./db/connect.js";
import { v2 as cloudinary } from "cloudinary";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import myHotelRoutes from "./routes/my-hotels.js";
import hotelRoutes from "./routes/hotels.js";
import bookingRoutes from "./routes/my-bookings.js";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.FRONTEND_URL, 
    credentials: true,
}));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/my-hotels", myHotelRoutes);
app.use("api/hotels", hotelRoutes);
app.use("/api/my-bookings", bookingRoutes);

const port = process.env.PORT || 7000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });
    } catch (error) {
        console.log(error);
    }
}

start();