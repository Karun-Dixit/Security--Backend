import jwt from "jsonwebtoken";
import mongoSanitize from "mongo-sanitize";

// admin authentication middleware
const authAdmin = async (req, res, next) => {
    try {
        let atoken = null;
        if (req.cookies && req.cookies.atoken) {
            atoken = req.cookies.atoken;
        } else {
            atoken = req.headers.aToken || req.headers.atoken;
        }
        if (!atoken) {
            return res.json({ success: false, message: 'Not Authorized Login Again' });
        }
        // Sanitize token before verification
        const sanitizedToken = mongoSanitize(atoken);
        const token_decode = jwt.verify(sanitizedToken, process.env.JWT_SECRET);
        if (token_decode.email !== process.env.ADMIN_EMAIL) {
            return res.json({ success: false, message: 'Not Authorized Login Again' });
        }
        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export default authAdmin;