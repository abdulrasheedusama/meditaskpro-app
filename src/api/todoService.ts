import { axiosInstance } from './axiosInstance';
import { Task, TaskPayload } from '../types/task';

const TODO_PATH = '/todo';

export const todoService = {
  async getTodos() {
    const response = await axiosInstance.get<Task[]>(TODO_PATH);
    return response.data;
  },
  async getTodoById(id: string) {
    const response = await axiosInstance.get<Task>(`${TODO_PATH}/${id}`);
    return response.data;
  },
  async createTodo(payload: TaskPayload) {
    const response = await axiosInstance.post<Task>(TODO_PATH, payload);
    return response.data;
  },
  async updateTodo(id: string, payload: TaskPayload) {
    const response = await axiosInstance.put<Task>(`${TODO_PATH}/${id}`, payload);
    return response.data;
  },
  async deleteTodo(id: string) {
    await axiosInstance.delete(`${TODO_PATH}/${id}`);
    return id;
  }
};
