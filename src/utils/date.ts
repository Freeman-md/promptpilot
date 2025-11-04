export function diffForHumans(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  const intervals: [number, string][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.34524, "week"],
    [12, "month"],
    [Number.POSITIVE_INFINITY, "year"],
  ];

  let count = seconds;
  let unit = "second";

  for (const [threshold, name] of intervals) {
    if (count < threshold) {
      unit = name;
      break;
    }
    count = count / threshold;
  }

  count = Math.floor(count);
  return count <= 1 ? `1 ${unit} ago` : `${count} ${unit}s ago`;
}
