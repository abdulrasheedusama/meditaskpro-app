export type RootStackParamList = {
  MainTabs: undefined;
  TaskForm: { taskId?: string } | undefined;
  TaskDetails: { taskId: string };
};

export type MainTabParamList = {
  Dashboard: undefined;
  Tasks: undefined;
  Schedule: undefined;
  Profile: undefined;
};
