import express from 'express'
import { getWeights, addWeight, deleteWeight, getStats } from '../controllers/weights.js'
import auth from '../middleware/auth.js'

const router = express.Router()

router.get('/', auth, getWeights)
router.post('/', auth, addWeight)
router.delete('/:id', auth, deleteWeight)
router.get('/stats', auth, getStats)

export default router