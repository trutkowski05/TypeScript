import { Router } from 'express'
import { getAllResources, createResource } from '../controllers/resourceController'

const router = Router()

router.get('/', getAllResources)
router.post('/', createResource)

export default router