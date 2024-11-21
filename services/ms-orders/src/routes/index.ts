import { injectCurrentUser } from '@devops-premade/ms-common'
import { Router } from 'express'

import { healthRoutes } from './health'
import { ordersRoutes } from './orders'

const router = Router()

// api/auth/health
router.use('/health', healthRoutes)
router.use('/',injectCurrentUser, ordersRoutes)

export { router as routes }
