const baseTheme = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32
  },
  radius: {
    sm: 10,
    md: 14,
    lg: 18,
    xl: 22,
    pill: 999
  },
  typography: {
    hero: 38,
    h1: 34,
    h2: 28,
    h3: 22,
    title: 18,
    body: 16,
    bodySmall: 14,
    caption: 12
  }
} as const;

export const lightTheme = {
  ...baseTheme,
  dark: false,
  colors: {
    primary: '#0E67C6',
    primaryDark: '#0A4B92',
    primaryLight: '#EAF3FF',
    background: '#F7F8FA',
    surface: '#FFFFFF',
    surfaceAlt: '#EEF4FB',
    border: '#E5E7EB',
    borderStrong: '#D7E2F0',
    text: '#111827',
    textMuted: '#6B7280',
    textSoft: '#9CA3AF',
    success: '#34C759',
    warning: '#E9B949',
    danger: '#E35D5B',
    dangerSoft: '#FFF4F4',
    info: '#60A5FA',
    chip: '#F1F5F9',
    tabInactive: '#94A3B8',
    shadow: 'rgba(15, 23, 42, 0.08)',
    profileHero: '#EAF3FF',
    avatarBackground: '#E5E7EB',
    progressTrack: '#D7E6F8',
    statusTrack: '#F3F4F6',
    infoSurface: '#F3F7FB',
    badgeMuted: '#EEF2F7',
    badgeMutedText: '#475569',
    badgePersonal: '#E8F1FF',
    badgeUrgent: '#FFF2D9',
    badgeUrgentText: '#B7791F',
    completedBorder: '#8CB7E8',
    completedSurface: '#EFF6FF'
  }
} as const;

export const darkTheme = {
  ...baseTheme,
  dark: true,
  colors: {
    primary: '#5BA4FF',
    primaryDark: '#2E79D6',
    primaryLight: '#132B47',
    background: '#08111F',
    surface: '#101A2B',
    surfaceAlt: '#162338',
    border: '#243347',
    borderStrong: '#31445F',
    text: '#F3F7FB',
    textMuted: '#9FB0C6',
    textSoft: '#6F819C',
    success: '#4DD08A',
    warning: '#F1C96A',
    danger: '#FF8B8B',
    dangerSoft: '#331A1E',
    info: '#7CB7FF',
    chip: '#172438',
    tabInactive: '#7387A5',
    shadow: 'rgba(2, 6, 23, 0.45)',
    profileHero: '#12243C',
    avatarBackground: '#1D2C44',
    progressTrack: '#223A59',
    statusTrack: '#172438',
    infoSurface: '#132033',
    badgeMuted: '#1B2A3F',
    badgeMutedText: '#AFC2D9',
    badgePersonal: '#17304E',
    badgeUrgent: '#3A2A12',
    badgeUrgentText: '#FFD48A',
    completedBorder: '#4D83BD',
    completedSurface: '#12263D'
  }
} as const;

export const theme = lightTheme;

export type AppTheme = typeof lightTheme | typeof darkTheme;
export type ThemeMode = 'light' | 'dark';
