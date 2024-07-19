import { Router } from 'express'

import { injectCurrentUser } from '../middlewares'
import { healthRoutes } from './health'
import { mediaRoutes } from './media'

const router = Router()

// api/auth/health
router.use('/health', healthRoutes)
router.use('/',injectCurrentUser, mediaRoutes)

export { router as Routes }
