import { injectCurrentUser } from '@devops-premade/ms-common'
import { Router } from 'express'

import { healthRoutes } from './health'
import { mediaRoutes } from './media'

const router = Router()

// api/auth/health
router.use('/health', healthRoutes)
router.use('/',injectCurrentUser, mediaRoutes)

export { router as routes }
