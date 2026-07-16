import fs from 'fs'
import path from 'path'
import { Request, Response } from 'express'

interface Workout {
    id: string,
    duration: number,
    activity: string,
    notes: string,
    date: string
}

interface ActivityStats {
    activity: string,
    sum: number,
    percentage: number
}

interface WorkoutStatistics {
    totalDuration: number,
    activities: ActivityStats[]
}

const DATA_PATH = path.join(__dirname, "data", "treningi.json")

export function readWorkouts(): Workout[] {
    if (!fs.existsSync(DATA_PATH)) {
        fs.writeFileSync(DATA_PATH, '[]', 'utf-8')
        return []
    }

    const data = fs.readFileSync(DATA_PATH, 'utf-8')
    const parsedData = JSON.parse(data)
    return parsedData
}

export function writeWorkouts(data: Workout[]): void {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2))
}

export function getAllWorkouts(req: Request, res: Response) {
    let workouts = readWorkouts()

    if (req.query.from) {
        workouts = workouts.filter(w => w.date >= (req.query.from as string))
    }

    if (req.query.to) {
        workouts = workouts.filter(w => w.date <= (req.query.to as string))
    }

    res.json(workouts)
}

export function createWorkout(req: Request, res: Response) {
    const { duration, activity, notes, date } = req.body

    const parsedDuration = Number(duration)

    if (isNaN(parsedDuration) || parsedDuration <= 0) {
        return res.status(400).json({ error: 'Błędne dane! (status 400)' })
    }

    if (!activity || !date) {
        return res.status(400).json({ error: 'Brak przekazanych danych! (status 400)' })
    }
    if (activity.trim() === '' || date.trim() === '') {
        return res.status(400).json({ error: 'Brak przekazanych danych! (status 400)' })
    }

    const newWorkout: Workout = {
        id: crypto.randomUUID(),
        duration: parsedDuration,
        activity: activity,
        notes: notes,
        date: date
    }

    let workouts = readWorkouts()
    workouts.push(newWorkout)
    writeWorkouts(workouts)

    return res.status(201).json(newWorkout)
}

export function deleteWorkout(req: Request, res: Response) {
    const { id } = req.params

    let workouts = readWorkouts()

    workouts = workouts.filter(w => w.id !== id)

    writeWorkouts(workouts)

    return res.json({ message: 'Docelowy trening został usunięty! (sukces)' })

}

export function getStatistics(req: Request, res: Response) {
    const workouts = readWorkouts()

    let totalDuration = 0

    workouts.forEach(w => totalDuration += w.duration)

    const activitySums: Record<string, number> = {}

    workouts.forEach(w => activitySums[w.activity] = (activitySums[w.activity] || 0) + w.duration)

    const activities = Object.entries(activitySums).map(([activityName, sum]) => {
        const percentage = totalDuration > 0 ? Math.round((sum / totalDuration) * 100) : 0
        return { activity: activityName, sum: sum, percentage: percentage }
    })
    return res.json({ totalDuration, activities })

}


