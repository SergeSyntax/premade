import { Router } from 'express'
import { healthRoutes } from './health'
import { authRoutes } from './auth'

const router = Router()

// api/auth/health
router.use('/health', healthRoutes)
router.use('/', authRoutes)

export { router as Routes }
