const jwt = require("jsonwebtoken")
const { JWT_SECRET } = require("./config")

const authMiddleware = (req, res, next) => {
    const header = req.headers.authorization
    if(!header || !header.startsWith('Bearer ')) {
        return res.status(403).json({message: 'Authorization header missing or incorrect'})
    }
    const token = header.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        //console.log('Decoded Token:', decoded);
        if(decoded.userId) {
            req.userId = decoded.userId;
            next();
        }
        else {
             return res.status(403).json({message: 'User ID not found in token' })
        }
    } catch(err) {
        return res.status(403).json({ message: 'Invalid token'})
    }
}

module.exports = {
  authMiddleware  
} 