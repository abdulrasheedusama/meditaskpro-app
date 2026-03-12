import { Feather } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Screen } from '../components/common/Screen';
import { SummaryCard } from '../components/task/SummaryCard';
import { TaskCard } from '../components/task/TaskCard';
import { TaskChip } from '../components/task/TaskChip';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { MainTabParamList, RootStackParamList } from '../navigation/types';
import { fetchTasks, hydrateTasks } from '../store/slices/tasksSlice';
import { useAppTheme, useThemeContext } from '../theme/ThemeProvider';
import { TaskCategory } from '../types/task';
import { formatFriendlyDate } from '../utils/format';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Dashboard'>,
  NativeStackScreenProps<RootStackParamList>
>;

const filters: Array<'All Tasks' | 'Work' | 'Personal' | 'Urgent'> = ['All Tasks', 'Work', 'Personal', 'Urgent'];

export const DashboardScreen = (_props: Props) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { mode, toggleMode } = useThemeContext();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackScreenProps<RootStackParamList>['navigation']>();
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.tasks);
  const [selectedFilter, setSelectedFilter] = useState<typeof filters[number]>('All Tasks');

  useEffect(() => {
    dispatch(hydrateTasks()).finally(() => dispatch(fetchTasks()));
  }, [dispatch]);

  const todaysTasks = useMemo(() => {
    const list = items.filter((task) => {
      if (selectedFilter === 'All Tasks') return true;
      return task.category === (selectedFilter as TaskCategory);
    });

    return list.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [items, selectedFilter]);

  const completedCount = items.filter((task) => task.status === 'Completed').length;

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Feather name="user" size={28} color={theme.colors.text} />
        </View>
        <Text style={styles.logo}>MediTaskPro</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Toggle dark mode"
          onPress={() => void toggleMode()}
          style={styles.themeToggle}
        >
          <Feather
            name={mode === 'dark' ? 'sun' : 'moon'}
            size={18}
            color={mode === 'dark' ? theme.colors.warning : theme.colors.primary}
          />
        </Pressable>
        <Feather name="bell" size={24} color={theme.colors.textMuted} />
      </View>

      <FlatList
        data={todaysTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom }]}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => dispatch(fetchTasks())} tintColor={theme.colors.primary} />}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <View>
              <Text style={styles.greeting}>Good Morning, Nimal</Text>
              <Text style={styles.date}>{formatFriendlyDate(new Date().toISOString())}</Text>
            </View>

            <SummaryCard completed={completedCount} total={items.length || 20} />

            <View style={styles.filtersRow}>
              {filters.map((filter) => (
                <TaskChip key={filter} label={filter} selected={filter === selectedFilter} onPress={() => setSelectedFilter(filter)} />
              ))}
            </View>

            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Today's Tasks</Text>
            </View>
            {error && !items.length ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
                <Pressable onPress={() => dispatch(fetchTasks())}>
                  <Text style={styles.retryText}>Retry</Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        }
        renderItem={({ item }) => <TaskCard task={item} onPress={() => navigation.navigate('TaskDetails', { taskId: item.id })} />}
        ItemSeparatorComponent={() => <View style={{ height: theme.spacing.md }} />}
        ListEmptyComponent={loading ? <ActivityIndicator size="large" color={theme.colors.primary} /> : <Text style={styles.empty}>No tasks found.</Text>}
      />

      <Pressable style={[styles.fab, { bottom: insets.bottom + 10 }]} onPress={() => navigation.navigate('TaskForm')}>
        <Feather name="plus" size={30} color="#FFF" />
      </Pressable>
    </Screen>
  );
};

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.sm,
      paddingBottom: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.avatarBackground,
      alignItems: 'center',
      justifyContent: 'center'
    },
    logo: {
      flex: 1,
      fontSize: 22,
      color: theme.colors.text,
      fontWeight: '800'
    },
    themeToggle: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.surfaceAlt,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    content: {
      padding: theme.spacing.lg,
      gap: theme.spacing.md
    },
    listHeader: {
      gap: theme.spacing.lg,
      marginBottom: theme.spacing.md
    },
    greeting: {
      fontSize: theme.typography.h1,
      lineHeight: 40,
      fontWeight: '800',
      color: theme.colors.text
    },
    date: {
      fontSize: theme.typography.title,
      color: theme.colors.textMuted
    },
    filtersRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm
    },
    sectionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    sectionTitle: {
      fontSize: 28,
      fontWeight: '800',
      color: theme.colors.text
    },

    fab: {
      position: 'absolute',
      right: theme.spacing.xl,
      width: 68,
      height: 68,
      borderRadius: 34,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 1,
      shadowRadius: 20,
      elevation: 10
    },
    empty: {
      color: theme.colors.textMuted,
      textAlign: 'center',
      marginTop: theme.spacing.xxxl,
      fontSize: theme.typography.body
    },
    errorBox: {
      backgroundColor: theme.colors.dangerSoft,
      borderRadius: theme.radius.md,
      padding: theme.spacing.md,
      gap: 8
    },
    errorText: {
      color: theme.colors.danger,
      fontSize: theme.typography.bodySmall
    },
    retryText: {
      color: theme.colors.primary,
      fontWeight: '700'
    }
  });
