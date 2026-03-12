import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Task } from '../../types/task';
import { formatTime } from '../../utils/format';
import { useAppTheme } from '../../theme/ThemeProvider';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
}

export const TaskCard = ({ task, onPress }: TaskCardProps) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const completed = task.status === 'Completed';
  const categoryLabel = (task.category ?? 'Work').toUpperCase();
  const badgeVariant = task.category === 'Urgent' ? 'urgentBadge' : task.category === 'Personal' ? 'personalBadge' : 'defaultBadge';
  const badgeTextVariant = task.category === 'Urgent' ? styles.urgentText : task.category === 'Personal' ? styles.personalText : styles.defaultText;

  return (
    <Pressable onPress={onPress} style={[styles.card, completed && styles.completedCard]}>
      <View style={[styles.checkCircle, completed && styles.checked]}>
        {completed ? <Feather name="check" size={16} color={theme.colors.primary} /> : null}
      </View>
      <View style={styles.content}>
        <View style={styles.rowBetween}>
          <Text style={[styles.title, completed && styles.completedText]}>{task.title}</Text>
          <View style={[styles.badge, styles[badgeVariant]]}>
            <Text style={[styles.badgeText, badgeTextVariant]}>{categoryLabel}</Text>
          </View>
        </View>
        <Text style={[styles.description, completed && styles.completedText]} numberOfLines={2}>{task.description}</Text>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Feather name="clock" size={14} color={theme.colors.textSoft} />
            <Text style={styles.metaText}>{formatTime(task.dueDate)}</Text>
          </View>
          {task.location ? (
            <View style={styles.metaItem}>
              <Feather name="briefcase" size={14} color={theme.colors.textSoft} />
              <Text style={styles.metaText}>{task.location}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
};

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.xl,
      padding: theme.spacing.lg,
      flexDirection: 'row',
      gap: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    completedCard: {
      opacity: 0.55,
      borderStyle: 'dashed'
    },
    checkCircle: {
      width: 28,
      height: 28,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: theme.colors.borderStrong,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 2
    },
    checked: {
      borderColor: theme.colors.completedBorder,
      backgroundColor: theme.colors.completedSurface
    },
    content: {
      flex: 1,
      gap: 8
    },
    rowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: theme.spacing.sm,
      alignItems: 'flex-start'
    },
    title: {
      flex: 1,
      fontSize: 28 / 1.4,
      color: theme.colors.text,
      fontWeight: '700'
    },
    description: {
      color: theme.colors.textMuted,
      fontSize: theme.typography.body,
      lineHeight: 22
    },
    metaRow: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      flexWrap: 'wrap'
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6
    },
    metaText: {
      color: theme.colors.textSoft,
      fontSize: theme.typography.bodySmall,
      fontWeight: '500'
    },
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 10
    },
    badgeText: {
      fontWeight: '700',
      fontSize: theme.typography.caption
    },
    urgentBadge: { backgroundColor: theme.colors.badgeUrgent },
    urgentText: { color: theme.colors.badgeUrgentText },
    personalBadge: { backgroundColor: theme.colors.badgePersonal },
    personalText: { color: theme.colors.primary },
    defaultBadge: { backgroundColor: theme.colors.badgeMuted },
    defaultText: { color: theme.colors.badgeMutedText },
    completedText: {
      textDecorationLine: 'line-through'
    }
  });
