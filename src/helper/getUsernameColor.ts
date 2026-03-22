export const getUsernameColor = (userId: string) => {
  const colors = [
    '#22c55e', // Green
    '#eab308', // Yellow
    '#f97316', // Orange
    '#ec4899', // Pink
    '#a855f7', // Purple
    '#06b6d4', // Cyan
    '#f43f5e', // Rose
    '#3b82f6', // Blue
    '#10b981', // Emerald
    '#8b5cf6', // Violet
  ];

  if (!userId) return colors[0];

  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % colors.length;
  return colors[index];
};