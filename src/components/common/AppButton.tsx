import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { useAppTheme } from '../../theme/ThemeProvider';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost' | 'danger';
  loading?: boolean;
}

export const AppButton = ({ title, onPress, variant = 'primary', loading }: AppButtonProps) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.base, styles[variant], pressed && styles.pressed]}
    >
      {loading ? <ActivityIndicator color={variant === 'primary' ? '#FFF' : theme.colors.text} /> : <Text style={[styles.text, styles[`${variant}Text`]]}>{title}</Text>}
    </Pressable>
  );
};

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    base: {
      minHeight: 60,
      borderRadius: theme.radius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 18,
      elevation: 6
    },
    primary: {
      backgroundColor: theme.colors.primary
    },
    ghost: {
      backgroundColor: 'transparent'
    },
    danger: {
      backgroundColor: theme.colors.dangerSoft
    },
    text: {
      fontSize: theme.typography.title,
      fontWeight: '700'
    },
    primaryText: {
      color: '#FFF'
    },
    ghostText: {
      color: theme.colors.textMuted
    },
    dangerText: {
      color: theme.colors.danger
    },
    pressed: {
      opacity: 0.9,
      transform: [{ scale: 0.99 }]
    }
  });
