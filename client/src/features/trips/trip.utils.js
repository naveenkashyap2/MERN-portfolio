export function groupByDay(items = []) {
  const map = new Map();
  items.forEach((item) => {
    const list = map.get(item.day) || [];
    list.push(item);
    map.set(item.day, list);
  });
  return [...map.entries()].sort((a, b) => a[0] - b[0]);
}

export function tripProgress(trip) {
  if (trip?.status === 'completed') return 100;
  if (trip?.status === 'active') return 45;
  if (trip?.status === 'planned') return 10;
  return 0;
}
