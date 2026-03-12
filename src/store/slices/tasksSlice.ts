import AsyncStorage from '@react-native-async-storage/async-storage';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { todoService } from '../../api/todoService';
import { Task, TaskCategory, TaskPayload, TaskPriority, TaskStatus, TASK_CATEGORIES, TASK_PRIORITIES } from '../../types/task';

const STORAGE_KEY = '@meditaskpro/tasks';
const seededTasks: Task[] = [
  {
    id: '101',
    title: 'Project Presentation',
    description: 'Final review of Q3 results deck',
    priority: 'High',
    status: 'Pending',
    category: 'Urgent',
    dueDate: new Date().toISOString(),
    location: 'Marketing',
    owner: 'Dr. Nimal'
  },
  {
    id: '102',
    title: 'Grocery Shopping',
    description: 'Pick up essentials for the week',
    priority: 'Medium',
    status: 'Pending',
    category: 'Personal',
    dueDate: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    owner: 'Dr. Nimal'
  },
  {
    id: '103',
    title: 'Team Sync',
    description: 'Weekly status update - Minutes sent',
    priority: 'Low',
    status: 'Completed',
    category: 'Work',
    dueDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    owner: 'Dr. Nimal'
  },
  {
    id: '104',
    title: 'Design Workshop',
    description: 'Main Conference Hall - UI/UX Review',
    priority: 'Medium',
    status: 'Pending',
    category: 'Work',
    dueDate: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
    owner: 'Dr. Nimal',
    location: 'Main Conference Hall'
  }
];

interface TasksState {
  items: Task[];
  selectedTask?: Task;
  loading: boolean;
  submitting: boolean;
  deleting: boolean;
  error?: string;
  hydrated: boolean;
}

const initialState: TasksState = {
  items: [],
  loading: false,
  submitting: false,
  deleting: false,
  hydrated: false
};

const isTaskCategory = (value: unknown): value is TaskCategory =>
  typeof value === 'string' && TASK_CATEGORIES.includes(value as TaskCategory);

const isTaskPriority = (value: unknown): value is TaskPriority =>
  typeof value === 'string' && TASK_PRIORITIES.includes(value as TaskPriority);

const isTaskStatus = (value: unknown): value is TaskStatus => value === 'Pending' || value === 'Completed';

const normalizeTask = (input: unknown, index = 0): Task => {
  const value = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>;
  const title = typeof value.title === 'string' && value.title.trim() ? value.title : `Task ${index + 1}`;
  const description =
    typeof value.description === 'string' && value.description.trim()
      ? value.description
      : typeof value.note === 'string' && value.note.trim()
        ? value.note
        : 'No description provided.';
  const category = isTaskCategory(value.category) ? value.category : 'Work';
  const priority = isTaskPriority(value.priority) ? value.priority : 'Medium';
  const status = isTaskStatus(value.status) ? value.status : value.completed === true ? 'Completed' : 'Pending';
  const dueDate =
    typeof value.dueDate === 'string' && !Number.isNaN(new Date(value.dueDate).getTime())
      ? value.dueDate
      : new Date().toISOString();

  return {
    id: typeof value.id === 'string' && value.id ? value.id : `${Date.now()}-${index}`,
    title,
    description,
    priority,
    status,
    category,
    dueDate,
    owner: typeof value.owner === 'string' && value.owner.trim() ? value.owner : 'Dr. Nimal',
    location: typeof value.location === 'string' && value.location.trim() ? value.location : undefined,
    createdAt: typeof value.createdAt === 'string' ? value.createdAt : undefined
  };
};

const normalizeTasks = (input: unknown): Task[] => {
  if (!Array.isArray(input)) {
    return seededTasks;
  }

  return input.map((task, index) => normalizeTask(task, index));
};

const persistTasks = async (tasks: Task[]) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const hydrateTasks = createAsyncThunk('tasks/hydrate', async () => {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? normalizeTasks(JSON.parse(raw)) : seededTasks;
});

export const fetchTasks = createAsyncThunk('tasks/fetch', async (_, { rejectWithValue }) => {
  try {
    const tasks = normalizeTasks(await todoService.getTodos());
    const next = tasks.length ? tasks : seededTasks;
    await persistTasks(next);
    return next;
  } catch (error) {
    const cached = await AsyncStorage.getItem(STORAGE_KEY);
    if (cached) {
      return normalizeTasks(JSON.parse(cached));
    }
    await persistTasks(seededTasks);
    return rejectWithValue((error as Error).message);
  }
});

export const fetchTaskById = createAsyncThunk('tasks/fetchById', async (id: string, { getState, rejectWithValue }) => {
  try {
    return normalizeTask(await todoService.getTodoById(id));
  } catch (error) {
    const state = getState() as { tasks: TasksState };
    const localTask = state.tasks.items.find((task) => task.id === id);
    if (localTask) {
      return localTask;
    }
    return rejectWithValue((error as Error).message);
  }
});

export const createTask = createAsyncThunk('tasks/create', async (payload: TaskPayload, { getState, rejectWithValue }) => {
  try {
    const created = normalizeTask(await todoService.createTodo(payload));
    const state = getState() as { tasks: TasksState };
    await persistTasks([created, ...state.tasks.items]);
    return created;
  } catch (error) {
    const localTask: Task = { id: String(Date.now()), ...payload };
    const state = getState() as { tasks: TasksState };
    await persistTasks([localTask, ...state.tasks.items]);
    return localTask;
  }
});

export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ id, payload }: { id: string; payload: TaskPayload }, { getState, rejectWithValue }) => {
    try {
      const updated = normalizeTask(await todoService.updateTodo(id, payload));
      const state = getState() as { tasks: TasksState };
      const nextTasks = state.tasks.items.map((task) => (task.id === id ? updated : task));
      await persistTasks(nextTasks);
      return updated;
    } catch (_error) {
      const updated: Task = { id, ...payload };
      const state = getState() as { tasks: TasksState };
      const nextTasks = state.tasks.items.map((task) => (task.id === id ? updated : task));
      await persistTasks(nextTasks);
      return updated;
    }
  }
);

export const deleteTask = createAsyncThunk('tasks/delete', async (id: string, { getState, rejectWithValue }) => {
  try {
    await todoService.deleteTodo(id);
  } catch (_error) {
    // Keep local delete for offline resilience.
  }
  const state = getState() as { tasks: TasksState };
  const nextTasks = state.tasks.items.filter((task) => task.id !== id);
  await persistTasks(nextTasks);
  return id;
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearSelectedTask(state) {
      state.selectedTask = undefined;
    },
    setSelectedTask(state, action: PayloadAction<Task | undefined>) {
      state.selectedTask = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(hydrateTasks.fulfilled, (state, action) => {
        state.items = action.payload;
        state.hydrated = true;
      })
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? action.error.message;
        if (!state.items.length) {
          state.items = seededTasks;
        }
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.selectedTask = action.payload;
      })
      .addCase(createTask.pending, (state) => {
        state.submitting = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.submitting = false;
        state.items = [action.payload, ...state.items.filter((task) => task.id !== action.payload.id)];
      })
      .addCase(createTask.rejected, (state, action) => {
        state.submitting = false;
        state.error = (action.payload as string) ?? action.error.message;
      })
      .addCase(updateTask.pending, (state) => {
        state.submitting = true;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.submitting = false;
        state.items = state.items.map((task) => (task.id === action.payload.id ? action.payload : task));
        state.selectedTask = action.payload;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.submitting = false;
        state.error = (action.payload as string) ?? action.error.message;
      })
      .addCase(deleteTask.pending, (state) => {
        state.deleting = true;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.deleting = false;
        state.items = state.items.filter((task) => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.deleting = false;
        state.error = (action.payload as string) ?? action.error.message;
      });
  }
});

export const { clearSelectedTask, setSelectedTask } = tasksSlice.actions;
export const tasksReducer = tasksSlice.reducer;

