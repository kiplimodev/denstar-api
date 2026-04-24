import { StatusCodes } from 'http-status-codes'

const errorHandler = (err, req, res, next) => {
    console.error(err)

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message)
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            error: errors.join(', ')
        })
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0]
        return res.status(StatusCodes.CONFLICT).json({
            success: false,
            error: `${field} already exists`
        })
    }

    // JWT error
    if (err.name === 'JsonWebTokenError') {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            error: 'Invalid token'
        })
    }

    // Default error
    return res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err.message || 'Something went wrong'
    })
}

export default errorHandler