export type Type = 'DESK' | 'ROOM';
export type Status = 'AVAILABLE' | 'RESERVED';

export interface Resource {
    id: string;
    name: string;
    type: Type;
    isActive: boolean;
}
