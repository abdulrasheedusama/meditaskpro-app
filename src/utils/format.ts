export const formatFriendlyDate = (value: string) => {
  const date = new Date(value);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

export const formatShortDate = (value: string) => {
  const date = new Date(value);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

export const formatTime = (value: string) => {
  const date = new Date(value);
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};
