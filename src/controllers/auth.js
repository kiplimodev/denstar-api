import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { generateToken } from '../utils/jwt.js'

export const register = async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            error: 'Please provide name, email and password'
        })
    }

    const user = await User.create({ name, email, password })
    const token = generateToken(user._id)

    res.status(StatusCodes.CREATED).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    })
}

export const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            error: 'Please provide email and password'
        })
    }

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            error: 'Invalid credentials'
        })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            error: 'Invalid credentials'
        })
    }

    const token = generateToken(user._id)

    res.status(StatusCodes.OK).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    })
}

export const getMe = async (req, res) => {
    res.status(StatusCodes.OK).json({
        success: true,
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email
        }
    })
}