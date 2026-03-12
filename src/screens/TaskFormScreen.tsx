import { yupResolver } from '@hookform/resolvers/yup';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import * as yup from 'yup';

import { AppButton } from '../components/common/AppButton';
import { AppTextInput } from '../components/common/AppTextInput';
import { Screen } from '../components/common/Screen';
import { TaskChip } from '../components/task/TaskChip';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { RootStackParamList } from '../navigation/types';
import { createTask, updateTask } from '../store/slices/tasksSlice';
import { useAppTheme } from '../theme/ThemeProvider';
import { TaskCategory, TaskPayload, TaskPriority, TASK_CATEGORIES, TASK_PRIORITIES } from '../types/task';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskForm'>;

const priorities: TaskPriority[] = TASK_PRIORITIES;
const categories: TaskCategory[] = TASK_CATEGORIES;

const schema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  priority: yup.mixed<TaskPriority>().oneOf(priorities).required(),
  category: yup.mixed<TaskCategory>().oneOf(categories).required()
});

interface FormValues {
  title: string;
  description: string;
  priority: TaskPriority;
  category: TaskCategory;
}

export const TaskFormScreen = ({ navigation, route }: Props) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const dispatch = useAppDispatch();
  const { items, submitting } = useAppSelector((state) => state.tasks);
  const task = useMemo(() => items.find((item) => item.id === route.params?.taskId), [items, route.params?.taskId]);

  const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'Medium',
      category: 'Work'
    }
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        priority: task.priority,
        category: categories.includes(task.category) ? task.category : 'Work'
      });
    }
  }, [reset, task]);

  const selectedPriority = watch('priority');
  const selectedCategory = watch('category');

  const onSubmit = async (values: FormValues) => {
    const payload: TaskPayload = {
      ...values,
      status: task?.status ?? 'Pending',
      dueDate: task?.dueDate ?? new Date().toISOString(),
      owner: task?.owner ?? 'Dr. Nimal',
      location: task?.location ?? values.category
    };

    try {
      if (task) {
        await dispatch(updateTask({ id: task.id, payload })).unwrap();
      } else {
        await dispatch(createTask(payload)).unwrap();
      }
      navigation.goBack();
      return;
    } catch (error) {
      Alert.alert('Unable to save task', String(error ?? 'Please try again.'));
    }
  };

  return (
    <Screen scrollable contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.back}>{'<'}</Text>
        </Pressable>
        <Text style={styles.title}>{task ? 'Edit Task' : 'Add Task'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <Controller
        control={control}
        name="title"
        render={({ field: { value, onChange } }) => (
          <AppTextInput
            label="Task Title"
            placeholder="e.g., Weekly Team Sync"
            value={value}
            onChangeText={onChange}
            error={errors.title?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field: { value, onChange } }) => (
          <AppTextInput
            label="Description"
            placeholder="Enter task details, notes, or specific instructions..."
            value={value}
            onChangeText={onChange}
            multiline
            error={errors.description?.message}
          />
        )}
      />

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Priority Level</Text>
        <View style={styles.rowWrap}>
          {priorities.map((priority) => (
            <TaskChip key={priority} label={priority} selected={selectedPriority === priority} onPress={() => setValue('priority', priority)} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Category</Text>
        <View style={styles.rowWrap}>
          {categories.map((category) => (
            <TaskChip key={category} label={category} selected={selectedCategory === category} onPress={() => setValue('category', category)} />
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <AppButton title="Save Task" onPress={handleSubmit(onSubmit)} loading={submitting} />
        <AppButton title="Cancel" onPress={() => navigation.goBack()} variant="ghost" />
      </View>
    </Screen>
  );
};

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    container: {
      gap: theme.spacing.xl
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    back: {
      fontSize: 32,
      color: theme.colors.primary
    },
    title: {
      fontSize: theme.typography.h2,
      fontWeight: '800',
      color: theme.colors.text
    },
    section: {
      gap: theme.spacing.md
    },
    sectionLabel: {
      fontSize: theme.typography.bodySmall,
      color: theme.colors.text,
      fontWeight: '700',
      letterSpacing: 1.2,
      textTransform: 'uppercase'
    },
    rowWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md
    },
    footer: {
      gap: theme.spacing.md,
      marginTop: theme.spacing.xl
    }
  });

