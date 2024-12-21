
import { Router } from 'express';

import { liveController, readyController } from '../controllers';

const router = Router();

router.get('/ready', readyController)
router.get('/live', liveController)

export { router as healthRoutes }
