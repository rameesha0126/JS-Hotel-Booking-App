import jwt from "jsonwebtoken"; 

const verifyToken = (req, res, next) => {
    const token = req.cookies["auth-token"];
    if (!token) {
        res.status(401).json({ message: "unauthorized" });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: "unauthorized" });
        return;
    }
}

export default verifyToken;