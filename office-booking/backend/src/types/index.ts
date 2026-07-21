export type Role = 'ADMIN' | 'EMPLOYEE'

export interface User {
    id: string
    email: string
    passwordHash: string
    role: Role
}

export type Type = 'DESK' | 'ROOM'

export interface Resource {
    id: string
    name: string
    type: Type
    isActive: boolean
    isBooked?: boolean
}

export type Status = 'ACTIVE' | 'CANCELLED'

export interface Booking {
    id: string
    userId: string
    resourceId: string  
    date: string
    status: Status
}
