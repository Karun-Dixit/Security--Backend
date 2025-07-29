import jwt from 'jsonwebtoken';

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
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        req.body.docId = token_decode.id
        next()
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export default authDoctor;