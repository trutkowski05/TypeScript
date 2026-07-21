import { Router } from 'express'
import { getAllResources, createResource } from '../controllers/resourceController'
import { authMiddleware } from '../middlewares/authMiddleware'

const router = Router()

router.get('/', getAllResources)
router.post('/', authMiddleware, createResource)

export default router