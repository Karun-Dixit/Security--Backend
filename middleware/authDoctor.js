import jwt from 'jsonwebtoken';
import mongoSanitize from 'mongo-sanitize';

// doctor authentication middleware
const authDoctor = async (req, res, next) => {
    let token = null;
    if (req.cookies && req.cookies.dtoken) {
        token = req.cookies.dtoken;
    } else if (req.headers.dtoken) {
        token = req.headers.dtoken;
    }
    if (!token) {
        return res.json({ success: false, message: 'Not Authorized Login Again' })
    }
    try {
        // Sanitize token before verification
        const sanitizedToken = mongoSanitize(token);
        const token_decode = jwt.verify(sanitizedToken, process.env.JWT_SECRET);
        req.body.docId = mongoSanitize(token_decode.id);
        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export default authDoctor;