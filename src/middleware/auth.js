import { StatusCodes } from 'http-status-codes'
import { verifyToken } from '../utils/jwt.js'
import User from '../models/User.js'

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            error: 'No token provided'
        })
    }

    const token = authHeader.split(' ')[1]

    try {
        const decoded = verifyToken(token)
        const user = await User.findById(decoded.id)
        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                error: 'User not found'
            })
        }
        req.user = user
        next()
    } catch (error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            error: 'Invalid or expired token'
        })
    }
}

export default auth