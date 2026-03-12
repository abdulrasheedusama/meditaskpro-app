import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { useAppTheme } from '../../theme/ThemeProvider';

interface AppTextInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  multiline?: boolean;
  error?: string;
}

export const AppTextInput = ({ label, placeholder, value, onChangeText, multiline, error }: AppTextInputProps) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        multiline={multiline}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSoft}
        value={value}
        onChangeText={onChangeText}
        style={[styles.input, multiline && styles.multiline, Boolean(error) && styles.inputError]}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    wrapper: {
      gap: theme.spacing.sm
    },
    label: {
      fontSize: theme.typography.bodySmall,
      color: theme.colors.text,
      fontWeight: '700',
      letterSpacing: 1.2,
      textTransform: 'uppercase'
    },
    input: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      minHeight: 64,
      paddingHorizontal: theme.spacing.lg,
      fontSize: theme.typography.title,
      color: theme.colors.text
    },
    multiline: {
      minHeight: 180,
      paddingTop: theme.spacing.lg
    },
    inputError: {
      borderColor: theme.colors.danger
    },
    error: {
      color: theme.colors.danger,
      fontSize: theme.typography.bodySmall,
      fontWeight: '500'
    }
  });
