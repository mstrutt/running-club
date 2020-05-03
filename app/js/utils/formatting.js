export function formatTime(time) {
  const parts = [];
  const hours = Math.floor(time / (60 * 60));
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  const minutes = Math.floor(time / 60) % 60;
  if (hours > 0 || minutes > 0) {
    parts.push(`${minutes}m`);
  }
  const seconds = time % 60;
  parts.push(`${seconds}s`);
  return parts.join(' ');
}

export function formatDistance(distance) {
  if (distance < 1000) {
    return `${distance}m`;
  }
  return `${(Math.round(distance / 100) / 10).toFixed(1)}km`
}
