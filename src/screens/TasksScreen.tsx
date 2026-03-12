import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { Screen } from '../components/common/Screen';
import { useAppTheme } from '../theme/ThemeProvider';

export const TasksScreen = () => {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <Screen contentContainerStyle={styles.container}>
      <Text style={styles.title}>Tasks</Text>
      <Text style={styles.body}>Use the dashboard to explore, filter, and manage all your tasks.</Text>
    </Screen>
  );
};

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    container: { justifyContent: 'center', alignItems: 'center', gap: 12 },
    title: { fontSize: theme.typography.h2, fontWeight: '800', color: theme.colors.text },
    body: { fontSize: theme.typography.body, color: theme.colors.textMuted, textAlign: 'center' }
  });
