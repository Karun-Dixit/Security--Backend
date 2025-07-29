import rateLimit from "express-rate-limit";

export const loginRateLimiter = rateLimit({
    windowMs: 10 * 1000, // 10 seconds
    max: 4, // limit each IP to 4 requests per windowMs
    message: {
        success: false,
        message: "Too many login attempts, please try again after 10 seconds."
    },
    standardHeaders: true,
    legacyHeaders: false,
}); 