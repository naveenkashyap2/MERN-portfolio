export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Location unavailable'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 10000 }
    );
  });
}

export function watchPosition(onPoint, onError) {
  if (!navigator.geolocation) {
    onError?.(new Error('Location unavailable'));
    return () => {};
  }
  const id = navigator.geolocation.watchPosition(
    (pos) =>
      onPoint({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        timestamp: pos.timestamp,
      }),
    onError,
    { enableHighAccuracy: true, maximumAge: 8000, timeout: 15000 }
  );
  return () => navigator.geolocation.clearWatch(id);
}
