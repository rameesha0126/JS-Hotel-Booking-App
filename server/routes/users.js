import express from "express"; 
import { check, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router(); 

// api/users/me 
router.get("/me", verifyToken, async (req, res) => {
    const userId = req.userId; 

    try {
        const user = await User.findById(userId).select("-password");
        if (!user) {
            res.status(400).json({ message: "User not found" });
            return;
        }
        res.json(user);
    } catch (error) {
        console.log(error); 
        res.status(500).json({ message: "something went wrong" });
    }
});

// api/users/register
router.post(
    '/register', 
    [
        check("firstName", "First name is required").isString(), 
        check("lastName", "Last name is required").isString(), 
        check("email", "Email is required").isEmail(), 
        check("password", "Password with 6 or more characters required").isLength({ min: 6 }), 
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ message: errors.array() });
            return;
        }
        
        try {
            let user = await User.findOne({
                email: req.body.email,
            });

            if (user) {
                res.status(400).json({ message: "User already exists" });
                return;
            }

            user = new User(req.body); 
            await user.save();

            const token = jwt.sign(
                { userId: user.id }, 
                process.env.JWT_SECRET_KEY, 
                { expiresIn: '1d' },
            ); 

            res.cookie('auth_token', token, {
                httpOnly: true, 
                secure: process.env.NODE_ENV === "production", 
                maxAge: 86400000,
            });
            res.status(200).send({ message: "User registered OK" });
            return;
        } catch (error) {
            console.log(error);
            res.status(500).send({ message: "Something went wrong" });
        }
});

export default router;