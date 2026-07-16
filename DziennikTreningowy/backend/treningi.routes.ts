import { Router } from "express";
import { getAllWorkouts, createWorkout, deleteWorkout, getStatistics } from "./treningi.controller.js";

const router = Router()

router.get('/statistics', getStatistics)
router.get('/', getAllWorkouts)
router.post('/', createWorkout)
router.delete('/:id', deleteWorkout)

export default router