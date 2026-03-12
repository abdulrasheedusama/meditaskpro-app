import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { Screen } from '../components/common/Screen';
import { useAppTheme, useThemeContext } from '../theme/ThemeProvider';

const settings = [
  { icon: 'phone', label: 'Contact Number', value: '+94 77 123 4567' },
  { icon: 'mail', label: 'Email', value: 'nimal@meditaskpro.app' },
  { icon: 'shield', label: 'Role', value: 'Lead care coordinator' },
  { icon: 'calendar', label: 'Default Schedule', value: 'Week view with reminders' }
] as const;

const quickActions = [
  { icon: 'bell', title: 'Medication reminders', subtitle: 'Push alerts 15 minutes early' },
  { icon: 'clock', title: 'Quiet hours', subtitle: '10:00 PM to 6:00 AM' },
  { icon: 'users', title: 'Family sharing', subtitle: 'Shared with wife and clinic assistant' }
] as const;

export const ProfileScreen = () => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { mode, setMode } = useThemeContext();
  const isDarkMode = mode === 'dark';

  return (
    <Screen scrollable contentContainerStyle={styles.container}>
      <View style={styles.heroCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>N</Text>
        </View>
        <View style={styles.heroCopy}>
          <Text style={styles.name}>Nimal Perera</Text>
          <Text style={styles.role}>Primary account owner</Text>
          <Text style={styles.caption}>Keeps medication reminders, appointments, and daily care tasks aligned.</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Settings</Text>
        {settings.map((item) => (
          <View key={item.label} style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <Feather name={item.icon} size={18} color={theme.colors.primary} />
            </View>
            <View style={styles.settingCopy}>
              <Text style={styles.settingLabel}>{item.label}</Text>
              <Text style={styles.settingValue}>{item.value}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.toggleCard}>
          <View style={styles.toggleCopy}>
            <Text style={styles.toggleTitle}>Dark Mode</Text>
            <Text style={styles.toggleSubtitle}>Apply a darker color scheme across the full app.</Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={(value) => void setMode(value ? 'dark' : 'light')}
            trackColor={{ false: theme.colors.statusTrack, true: theme.colors.primary }}
            thumbColor="#FFFFFF"
          />
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
    heroCard: {
      backgroundColor: theme.colors.profileHero,
      borderRadius: theme.radius.xl,
      padding: theme.spacing.xl,
      flexDirection: 'row',
      gap: theme.spacing.lg,
      alignItems: 'center'
    },
    avatar: {
      width: 76,
      height: 76,
      borderRadius: 38,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary
    },
    avatarText: {
      color: '#FFF',
      fontSize: theme.typography.h2,
      fontWeight: '800'
    },
    heroCopy: {
      flex: 1,
      gap: 4
    },
    name: {
      fontSize: theme.typography.h2,
      fontWeight: '800',
      color: theme.colors.text
    },
    role: {
      fontSize: theme.typography.title,
      color: theme.colors.primary,
      fontWeight: '700'
    },
    caption: {
      fontSize: theme.typography.body,
      color: theme.colors.textMuted,
      lineHeight: 22
    },
    section: {
      gap: theme.spacing.md
    },
    sectionTitle: {
      fontSize: theme.typography.title,
      fontWeight: '800',
      color: theme.colors.text
    },
    settingRow: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    settingIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.surfaceAlt,
      alignItems: 'center',
      justifyContent: 'center'
    },
    settingCopy: {
      flex: 1,
      gap: 2
    },
    settingLabel: {
      fontSize: theme.typography.bodySmall,
      color: theme.colors.textSoft,
      textTransform: 'uppercase',
      letterSpacing: 1
    },
    settingValue: {
      fontSize: theme.typography.title,
      color: theme.colors.text,
      fontWeight: '600'
    },
    toggleCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.xl,
      padding: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    toggleCopy: {
      flex: 1,
      gap: 2
    },
    toggleTitle: {
      fontSize: theme.typography.title,
      color: theme.colors.text,
      fontWeight: '700'
    },
    toggleSubtitle: {
      fontSize: theme.typography.body,
      color: theme.colors.textMuted,
      lineHeight: 22
    }
  });
