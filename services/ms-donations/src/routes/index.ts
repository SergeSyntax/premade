import { injectCurrentUser, requireAuth } from '@devops-premade/ms-common'
import { Router } from 'express'

import { donationsRoutes } from './donations'
import { healthRoutes } from './health'

const router = Router()

// api/auth/health
router.use('/health', healthRoutes)
router.use('/',injectCurrentUser, requireAuth, donationsRoutes)

export { router as routes }
