import { Router } from 'express'
import { getAllResources } from '../controllers/resourceController'

const router = Router()

router.get('/', getAllResources)

export default router