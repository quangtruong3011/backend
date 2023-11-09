import jwt from "jsonwebtoken";
import "dotenv/config";

export const authMiddleware = (req, res, next) => {
    const token = req.headers["x-access-token"];

    if (!token) {
        return res.status(401).send({
            message: "Token is not provided",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(403).send({
                message: "Token is expired",
            });
        }
        return res.status(401).send({
            message: "Token is not valid",
        });
    }
};