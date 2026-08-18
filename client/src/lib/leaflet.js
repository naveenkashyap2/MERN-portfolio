import L from 'leaflet';

export function pinIcon(color = '#3B82F6') {
  return L.divIcon({
    className: '',
    html: `<span style="display:block;width:16px;height:16px;border-radius:999px;background:${color};border:2px solid #F8FAFC;box-shadow:0 0 0 6px ${color}33"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}
