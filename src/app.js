import 'dotenv/config'
import express from 'express'
import 'express-async-errors'
import cors from 'cors'
import helmet from 'helmet'
import connectMongoDB from './db/mongodb.js'
import authRoutes from './routes/auth.js'
import weightRoutes from './routes/weights.js'
import errorHandler from './middleware/errorHandler.js'

const app = express()
const PORT = process.env.PORT || 3000

// Security middleware
app.use(helmet())

// CORS
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

// Parse JSON
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/weights', weightRoutes)

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Denstar API is running' })
})

// Error handler
app.use(errorHandler)

// Connect to MongoDB and start server
try {
    await connectMongoDB(process.env.MONGO_URI)
    console.log('Connected to MongoDB')
    app.listen(PORT, () => {
        console.log(`Denstar API running on port ${PORT}`)
    })
} catch (error) {
    console.log(error)
}

export default app