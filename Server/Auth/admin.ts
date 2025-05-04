import Jwt from "jsonwebtoken";
import { JWT_ADMIN_PASSWORD } from "./../config";
import { JwtPayload } from "./../interfaces";

export const adminAuth = (req: any, res: any, next: any) => {
    const token = req.headers.token;

    if (!token) {
        return res.status(401).json({
            Message: "Token is missing",
        });
    }

    if (!JWT_ADMIN_PASSWORD) {
        res.status(500).json({
            Message: "Server configuration error: Missing JWT_SECRET"
        });
        return
    }

    try {
        const response = Jwt.verify(token, JWT_ADMIN_PASSWORD) as JwtPayload;
        if (response) {
            req.adminId = response.id
            next();
        }
    } catch (err) {
        return res.status(403).json({
            Message: "Invalid or expired token",
        });
    }
};