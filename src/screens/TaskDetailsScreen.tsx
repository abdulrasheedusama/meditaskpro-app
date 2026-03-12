import { Feather } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useMemo } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/common/AppButton';
import { Screen } from '../components/common/Screen';
import { RootStackParamList } from '../navigation/types';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { deleteTask, fetchTaskById, updateTask } from '../store/slices/tasksSlice';
import { useAppTheme } from '../theme/ThemeProvider';
import { formatShortDate } from '../utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskDetails'>;

export const TaskDetailsScreen = ({ navigation, route }: Props) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const dispatch = useAppDispatch();
  const { items, deleting } = useAppSelector((state) => state.tasks);
  const task = useMemo(() => items.find((item) => item.id === route.params.taskId), [items, route.params.taskId]);

  useEffect(() => {
    if (!task) {
      dispatch(fetchTaskById(route.params.taskId));
    }
  }, [dispatch, route.params.taskId, task]);

  if (!task) {
    return (
      <Screen>
        <Text style={styles.empty}>Task not found.</Text>
      </Screen>
    );
  }

  const categoryLabel = (task.category ?? 'Work').toUpperCase();
  const priorityLabel = (task.priority ?? 'Medium').toUpperCase();

  const toggleStatus = async () => {
    try {
      await dispatch(
        updateTask({
          id: task.id,
          payload: {
            title: task.title,
            description: task.description,
            priority: task.priority,
            category: task.category,
            dueDate: task.dueDate,
            owner: task.owner,
            location: task.location,
            status: task.status === 'Completed' ? 'Pending' : 'Completed'
          }
        })
      ).unwrap();
    } catch (error) {
      Alert.alert('Unable to update task', String(error ?? 'Please try again.'));
    }
  };

  const onDelete = () => {
    Alert.alert('Delete task', 'Are you sure you want to remove this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await dispatch(deleteTask(task.id)).unwrap();
            navigation.goBack();
          } catch (error) {
            Alert.alert('Unable to delete task', String(error ?? 'Please try again.'));
          }
        }
      }
    ]);
  };

  return (
    <Screen scrollable contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.back}>{'<'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Task Details</Text>
        <Feather name="more-vertical" size={24} color={theme.colors.text} />
      </View>

      <View style={styles.badgeRow}>
        <View style={[styles.categoryBadge, styles.blueBadge]}><Text style={styles.blueText}>{categoryLabel}</Text></View>
        <View style={styles.categoryBadge}><Text style={styles.grayText}>{priorityLabel}</Text></View>
      </View>

      <Text style={styles.title}>{task.title}</Text>

      <View style={styles.statusCard}>
        <Text style={styles.sectionLabel}>Current Status</Text>
        <View style={styles.statusRow}>
          <Text style={styles.statusText}>{task.status === 'Completed' ? 'Completed' : 'Active / In Progress'}</Text>
          <Pressable style={styles.statusToggle} onPress={toggleStatus}>
            <View style={[styles.togglePill, task.status === 'Pending' && styles.togglePillActive]}><Text style={[styles.toggleText, task.status === 'Pending' && styles.toggleTextActive]}>Active</Text></View>
            <View style={[styles.togglePill, task.status === 'Completed' && styles.togglePillActive]}><Text style={[styles.toggleText, task.status === 'Completed' && styles.toggleTextActive]}>Completed</Text></View>
          </Pressable>
        </View>
      </View>

      <View style={styles.metaStack}>
        <View style={styles.infoTag}><Feather name="calendar" size={18} color={theme.colors.primary} /><Text style={styles.infoText}>{`Due: ${formatShortDate(task.dueDate)}`}</Text></View>
        <View style={styles.infoTag}><Feather name="user" size={18} color={theme.colors.primary} /><Text style={styles.infoText}>{`Owner: ${task.owner ?? 'Dr. Nimal'}`}</Text></View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeading}>Description</Text>
        <Text style={styles.description}>{task.description}</Text>
      </View>

      <View style={styles.requirementCard}>
        <View style={styles.requirementHeadingRow}>
          <Feather name="clipboard" size={20} color={theme.colors.primary} />
          <Text style={styles.requirementHeading}>Requirements</Text>
        </View>
        {[task.title, task.description.split('.')[0], `Prepare ${task.category.toLowerCase()} follow-up`].map((item) => (
          <View key={item} style={styles.requirementItem}>
            <Feather name="check-circle" size={18} color="#CBD5E1" />
            <Text style={styles.requirementText}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actionsRow}>
        <View style={{ flex: 1 }}>
          <AppButton title="Edit Task" onPress={() => navigation.navigate('TaskForm', { taskId: task.id })} />
        </View>
        <View style={styles.deleteButtonWrap}>
          <AppButton title={deleting ? '...' : 'Delete'} onPress={onDelete} variant="danger" loading={deleting} />
        </View>
      </View>
    </Screen>
  );
};

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    container: {
      gap: theme.spacing.lg
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    back: {
      fontSize: 30,
      color: theme.colors.primary
    },
    headerTitle: {
      fontSize: theme.typography.h2,
      fontWeight: '800',
      color: theme.colors.text
    },
    badgeRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm
    },
    categoryBadge: {
      backgroundColor: theme.colors.badgeMuted,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 8
    },
    blueBadge: {
      backgroundColor: theme.colors.badgePersonal
    },
    blueText: {
      color: theme.colors.primary,
      fontWeight: '800',
      fontSize: theme.typography.caption
    },
    grayText: {
      color: theme.colors.badgeMutedText,
      fontWeight: '800',
      fontSize: theme.typography.caption
    },
    title: {
      fontSize: 40 / 1.35,
      fontWeight: '800',
      color: theme.colors.text,
      lineHeight: 40
    },
    statusCard: {
      gap: theme.spacing.sm
    },
    sectionLabel: {
      textTransform: 'uppercase',
      letterSpacing: 1,
      fontWeight: '700',
      color: theme.colors.textMuted,
      fontSize: theme.typography.bodySmall
    },
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.md
    },
    statusText: {
      color: theme.colors.primary,
      fontSize: theme.typography.title,
      fontWeight: '800',
      flex: 1
    },
    statusToggle: {
      flexDirection: 'row',
      backgroundColor: theme.colors.statusTrack,
      padding: 4,
      borderRadius: theme.radius.pill,
      minWidth: 220
    },
    togglePill: {
      flex: 1,
      borderRadius: theme.radius.pill,
      paddingVertical: 10,
      alignItems: 'center'
    },
    togglePillActive: {
      backgroundColor: theme.colors.primary
    },
    toggleText: {
      color: theme.colors.textMuted,
      fontWeight: '700'
    },
    toggleTextActive: {
      color: '#FFF'
    },
    metaStack: {
      gap: theme.spacing.sm
    },
    infoTag: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: 8,
      backgroundColor: theme.colors.infoSurface,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: 12
    },
    infoText: {
      color: theme.colors.text,
      fontSize: theme.typography.title,
      fontWeight: '600'
    },
    section: {
      gap: theme.spacing.sm
    },
    sectionHeading: {
      fontSize: theme.typography.h2,
      fontWeight: '800',
      color: theme.colors.text
    },
    description: {
      color: theme.colors.badgeMutedText,
      fontSize: theme.typography.title,
      lineHeight: 32
    },
    requirementCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.xl,
      padding: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: theme.spacing.md
    },
    requirementHeadingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8
    },
    requirementHeading: {
      fontSize: theme.typography.title,
      fontWeight: '800',
      color: theme.colors.text
    },
    requirementItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10
    },
    requirementText: {
      color: theme.colors.textMuted,
      fontSize: theme.typography.title
    },
    actionsRow: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      alignItems: 'center',
      marginTop: theme.spacing.xxxl
    },
    deleteButtonWrap: {
      width: 120
    },
    empty: {
      color: theme.colors.textMuted,
      marginTop: theme.spacing.xxxl,
      textAlign: 'center'
    }
  });

