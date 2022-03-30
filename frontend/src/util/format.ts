export const formatSize = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 B';

  const k = 1000;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const formatTime = (timeInSeconds: number): string => {
  const result = new Date(Math.round(timeInSeconds) * 1000)
    .toISOString()
    .substring(11, 19);
  if (+result.substring(0, 2) > 0) {
    return result;
  } else {
    return result.substring(3);
  }
};
