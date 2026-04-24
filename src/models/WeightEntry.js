import mongoose from 'mongoose'

const weightEntrySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    weight: {
        type: Number,
        required: [true, 'Weight is required'],
        min: [20, 'Weight must be at least 20kg'],
        max: [500, 'Weight cannot exceed 500kg']
    },
    unit: {
        type: String,
        enum: ['kg', 'lbs'],
        default: 'kg'
    },
    date: {
        type: Date,
        required: [true, 'Date is required'],
        default: Date.now
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [200, 'Notes cannot exceed 200 characters']
    }
}, {
    timestamps: true
})

// Ensure one entry per user per date
weightEntrySchema.index({ user: 1, date: 1 }, { unique: true })

export default mongoose.model('WeightEntry', weightEntrySchema)