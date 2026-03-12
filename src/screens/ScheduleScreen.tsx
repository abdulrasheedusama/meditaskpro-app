import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { Screen } from '../components/common/Screen';
import { useAppTheme } from '../theme/ThemeProvider';

export const ScheduleScreen = () => {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <Screen contentContainerStyle={styles.container}>
      <Text style={styles.title}>Schedule</Text>
      <Text style={styles.body}>Calendar integration can be added next without changing the navigation shell.</Text>
    </Screen>
  );
};

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    container: { justifyContent: 'center', alignItems: 'center', gap: 12 },
    title: { fontSize: theme.typography.h2, fontWeight: '800', color: theme.colors.text },
    body: { fontSize: theme.typography.body, color: theme.colors.textMuted, textAlign: 'center' }
  });
