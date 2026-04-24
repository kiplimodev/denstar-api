import { StatusCodes } from 'http-status-codes'
import WeightEntry from '../models/WeightEntry.js'

export const getWeights = async (req, res) => {
    const entries = await WeightEntry.find({ user: req.user._id })
        .sort({ date: -1 })

    res.status(StatusCodes.OK).json({
        success: true,
        count: entries.length,
        data: entries
    })
}

export const addWeight = async (req, res) => {
    const { weight, unit, date, notes } = req.body

    const entry = await WeightEntry.create({
        user: req.user._id,
        weight,
        unit,
        date,
        notes
    })

    res.status(StatusCodes.CREATED).json({
        success: true,
        data: entry
    })
}

export const deleteWeight = async (req, res) => {
    const entry = await WeightEntry.findOne({
        _id: req.params.id,
        user: req.user._id
    })

    if (!entry) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            error: 'Entry not found'
        })
    }

    await entry.deleteOne()

    res.status(StatusCodes.OK).json({
        success: true,
        message: 'Entry deleted successfully'
    })
}

export const getStats = async (req, res) => {
    const entries = await WeightEntry.find({ user: req.user._id })
        .sort({ date: 1 })

    if (entries.length === 0) {
        return res.status(StatusCodes.OK).json({
            success: true,
            data: {
                totalEntries: 0,
                currentWeight: null,
                startWeight: null,
                lowestWeight: null,
                highestWeight: null,
                totalChange: null,
                movingAverage: null
            }
        })
    }

    const weights = entries.map(e => e.weight)
    const currentWeight = weights[weights.length - 1]
    const startWeight = weights[0]
    const lowestWeight = Math.min(...weights)
    const highestWeight = Math.max(...weights)
    const totalChange = currentWeight - startWeight

    // 7-day moving average
    const last7 = weights.slice(-7)
    const movingAverage = last7.reduce((a, b) => a + b, 0) / last7.length

    res.status(StatusCodes.OK).json({
        success: true,
        data: {
            totalEntries: entries.length,
            currentWeight,
            startWeight,
            lowestWeight,
            highestWeight,
            totalChange: Math.round(totalChange * 100) / 100,
            movingAverage: Math.round(movingAverage * 100) / 100
        }
    })
}