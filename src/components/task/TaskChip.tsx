import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { useAppTheme } from '../../theme/ThemeProvider';

interface TaskChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

export const TaskChip = ({ label, selected, onPress }: TaskChipProps) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <Pressable onPress={onPress} style={[styles.chip, selected && styles.selected]}>
      <Text style={[styles.text, selected && styles.selectedText]}>{label}</Text>
    </Pressable>
  );
};

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    chip: {
      paddingHorizontal: theme.spacing.lg,
      minHeight: 42,
      borderRadius: theme.radius.pill,
      backgroundColor: theme.colors.chip,
      alignItems: 'center',
      justifyContent: 'center'
    },
    selected: {
      backgroundColor: theme.colors.primary
    },
    text: {
      fontSize: theme.typography.body,
      color: theme.colors.textMuted,
      fontWeight: '600'
    },
    selectedText: {
      color: '#FFF'
    }
  });
