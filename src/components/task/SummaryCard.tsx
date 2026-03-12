import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '../../theme/ThemeProvider';

interface SummaryCardProps {
  completed: number;
  total: number;
}

export const SummaryCard = ({ completed, total }: SummaryCardProps) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const progress = total === 0 ? 0 : completed / total;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.heading}>Daily Task Completion</Text>
        <Text style={styles.heading}>{`${completed}/${total}`}</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${Math.max(progress * 100, 8)}%` }]} />
      </View>
      <Text style={styles.caption}>{`Almost there! ${Math.max(total - completed, 0)} priority tasks remaining.`}</Text>
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.primaryLight,
      borderRadius: theme.radius.xl,
      borderWidth: 1,
      borderColor: theme.colors.borderStrong,
      padding: theme.spacing.lg,
      gap: theme.spacing.md
    },
    topRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    heading: {
      color: theme.colors.primary,
      fontSize: theme.typography.title,
      fontWeight: '700'
    },
    progressTrack: {
      height: 10,
      borderRadius: theme.radius.pill,
      backgroundColor: theme.colors.progressTrack,
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      borderRadius: theme.radius.pill,
      backgroundColor: theme.colors.primary
    },
    caption: {
      fontSize: theme.typography.body,
      color: theme.colors.textMuted
    }
  });
