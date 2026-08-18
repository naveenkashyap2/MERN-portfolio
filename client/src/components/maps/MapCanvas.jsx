import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Maximize, Navigation } from 'lucide-react';
import { cn } from '../../utils/cn';

const W = 1000;
const H = 620;

function boundsOf(points) {
  if (!points?.length) return null;
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;
  for (const p of points) {
    if (p.lat < minLat) minLat = p.lat;
    if (p.lat > maxLat) maxLat = p.lat;
    if (p.lng < minLng) minLng = p.lng;
    if (p.lng > maxLng) maxLng = p.lng;
  }
  return { minLat, maxLat, minLng, maxLng };
}

function project(lat, lng, b) {
  const spanLng = b.maxLng - b.minLng || 1;
  const spanLat = b.maxLat - b.minLat || 1;
  const nx = (lng - b.minLng) / spanLng;
  const ny = (lat - b.minLat) / spanLat;
  return { x: nx * W, y: (1 - ny) * H };
}

function smoothPath(pts) {
  if (!pts.length) return '';
  if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i += 1) {
    const a = pts[i];
    const b = pts[i + 1];
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    d += ` Q ${mx} ${my - Math.min(60, Math.abs(b.x - a.x) * 0.18)} ${b.x} ${b.y}`;
  }
  return d;
}

/**
 * Lightweight interactive map (SVG). Deterministic and offline-friendly —
 * swap for Leaflet / Mapbox behind this component when a tile provider is
 * connected. Supports pan (drag), zoom, fit-to-route and animated routes.
 */
export default function MapCanvas({
  markers = [],
  routePoints = null,
  height = 420,
  className,
  onMarkerClick,
  label,
}) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const drag = useRef(null);

  const pts = useMemo(() => {
    const all = [...markers.map((m) => ({ lat: m.lat, lng: m.lng }))];
    if (routePoints) all.push(...routePoints.map((p) => ({ lat: p.lat, lng: p.lng })));
    return all;
  }, [markers, routePoints]);

  const bounds = useMemo(() => boundsOf(pts), [pts]);

  const projected = useMemo(() => {
    if (!bounds) return { markers: [], route: [] };
    return {
      markers: markers.map((m) => ({ ...m, ...project(m.lat, m.lng, bounds) })),
      route: routePoints ? routePoints.map((p) => project(p.lat, p.lng, bounds)) : [],
    };
  }, [bounds, markers, routePoints]);

  const onPointerDown = (e) => {
    drag.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!drag.current) return;
    setOffset({ x: drag.current.ox + (e.clientX - drag.current.x), y: drag.current.oy + (e.clientY - drag.current.y) });
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  if (!bounds) {
    return (
      <div style={{ height }} className={cn('rounded-2xl bg-ink-850 border border-white/[0.08] flex items-center justify-center text-muted text-sm', className)}>
        No coordinates available yet.
      </div>
    );
  }

  return (
    <div
      className={cn('relative overflow-hidden rounded-2xl bg-ink-900 border border-white/[0.08] select-none', className)}
      style={{ height }}
    >
      {/* subtle grid backdrop */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        aria-hidden
      >
        <defs>
          <pattern id="grid" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M 44 0 L 0 0 0 44" fill="none" stroke="rgba(255,255,255,0.045)" strokeWidth="1" />
          </pattern>
          <radialGradient id="mapGlow" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor="rgba(59,130,246,0.12)" />
            <stop offset="100%" stopColor="rgba(6,182,212,0)" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill="url(#mapGlow)" />
        <rect width={W} height={H} fill="url(#grid)" />
      </svg>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        role="img"
        aria-label={label || 'Map'}
      >
        <g transform={`translate(${offset.x} ${offset.y}) scale(${zoom})`} style={{ transformOrigin: 'center' }}>
          {projected.route.length > 1 && (
            <>
              <path d={smoothPath(projected.route)} fill="none" stroke="rgba(6,182,212,0.18)" strokeWidth={10} strokeLinecap="round" />
              <motion.path
                d={smoothPath(projected.route)}
                fill="none"
                stroke="url(#routeGrad)"
                strokeWidth={3.5}
                strokeLinecap="round"
                strokeDasharray={2200}
                initial={{ strokeDashoffset: 2200 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.8, ease: 'easeInOut' }}
              />
              <defs>
                <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
            </>
          )}

          {projected.markers.map((m, i) => (
            <g key={m.id || i} transform={`translate(${m.x} ${m.y})`} onClick={() => onMarkerClick?.(m)} style={{ cursor: onMarkerClick ? 'pointer' : 'default' }}>
              {m.kind === 'user' && (
                <circle r={16} fill="rgba(59,130,246,0.18)">
                  <animate attributeName="r" values="12;22;12" dur="2.2s" repeatCount="indefinite" />
                </circle>
              )}
              {m.kind === 'destination' && (
                <circle r={14} fill="rgba(34,197,94,0.2)">
                  <animate attributeName="r" values="10;20;10" dur="2.2s" repeatCount="indefinite" />
                </circle>
              )}
              <circle r={m.kind === 'user' ? 7 : m.kind === 'destination' ? 8 : 5.5} fill={m.color || (m.kind === 'destination' ? '#22C55E' : m.kind === 'user' ? '#3B82F6' : '#94A3B8')} stroke="#0B1120" strokeWidth={2} />
              {m.label && (
                <text y={-12} textAnchor="middle" className="fill-white/90" style={{ fontSize: 13, fontWeight: 600 }}>
                  {m.label}
                </text>
              )}
            </g>
          ))}
        </g>
      </svg>

      {/* controls */}
      <div className="absolute right-3 top-3 flex flex-col gap-1.5">
        <button onClick={() => setZoom((z) => Math.min(2.4, z + 0.25))} className="w-8 h-8 rounded-lg glass text-body flex items-center justify-center hover:bg-white/[0.1]" aria-label="Zoom in">
          <Plus size={15} />
        </button>
        <button onClick={() => setZoom((z) => Math.max(0.6, z - 0.25))} className="w-8 h-8 rounded-lg glass text-body flex items-center justify-center hover:bg-white/[0.1]" aria-label="Zoom out">
          <Minus size={15} />
        </button>
        <button
          onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }}
          className="w-8 h-8 rounded-lg glass text-body flex items-center justify-center hover:bg-white/[0.1]"
          aria-label="Fit route"
        >
          <Maximize size={14} />
        </button>
      </div>

      <div className="absolute left-3 bottom-3 glass rounded-lg px-2.5 py-1.5 text-[11px] text-muted flex items-center gap-1.5">
        <Navigation size={12} className="text-cyan" />
        Estimated route
      </div>
    </div>
  );
}
