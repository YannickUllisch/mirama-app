export const PriorityType = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
} as const
export type PriorityType = (typeof PriorityType)[keyof typeof PriorityType]

export const StatusType = {
  ACTIVE: 'ACTIVE',
  CANCELLED: 'CANCELLED',
  ON_HOLD: 'ON_HOLD',
  FINISHED: 'FINISHED',
} as const
export type StatusType = (typeof StatusType)[keyof typeof StatusType]

export const TaskStatusType = {
  NEW: 'NEW',
  ACTIVE: 'ACTIVE',
  DONE: 'DONE',
} as const
export type TaskStatusType =
  (typeof TaskStatusType)[keyof typeof TaskStatusType]
