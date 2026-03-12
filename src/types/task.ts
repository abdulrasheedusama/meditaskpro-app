export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Pending' | 'Completed';
export type TaskCategory = 'Work' | 'Personal' | 'Health' | 'Focus' | 'Urgent' | 'Finance' | 'Internal';

export const TASK_PRIORITIES: TaskPriority[] = ['Low', 'Medium', 'High'];
export const TASK_CATEGORIES: TaskCategory[] = ['Work', 'Personal', 'Health', 'Focus', 'Urgent', 'Finance', 'Internal'];

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  category: TaskCategory;
  dueDate: string;
  owner?: string;
  location?: string;
  createdAt?: string;
}

export interface TaskPayload {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  category: TaskCategory;
  dueDate: string;
  owner?: string;
  location?: string;
}
