import Jwt from "jsonwebtoken";
import { JWT_USER_PASSWORD } from "./../config";

export const userAuth = (req: any, res: any, next: any) => {
    const token = req.headers.token;

    if (!token) {
        return res.status(401).json({
            Message: "Token is missing",
        });
    }

    if (!JWT_USER_PASSWORD) {
        res.status(500).json({
            Message: "Server configuration error: Missing JWT_SECRET"
        });
        return
    }

    try {
        const response = Jwt.verify(token, JWT_USER_PASSWORD);
        if (response) {
            next();
        }
    } catch (err) {
        return res.status(403).json({
            Message: "Invalid or expired token",
        });
    }
};