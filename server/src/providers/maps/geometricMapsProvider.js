const { haversineKm, walkingEtaMinutes, drivingEtaMinutes } = require('../../utils/distance');
const { TRUST } = require('../../constants');

function line(origin, destination) {
  return [origin, destination];
}

function plan({ origin, destination, mode = 'driving' }) {
  const distanceKm = Number(haversineKm(origin, destination).toFixed(2));
  const durationMinutes =
    mode === 'walking'
      ? walkingEtaMinutes(distanceKm)
      : mode === 'transit'
        ? Math.round(drivingEtaMinutes(distanceKm, 28) * 1.15)
        : drivingEtaMinutes(distanceKm, mode === 'driving' ? 42 : 38);

  return {
    provider: 'geometric',
    live: false,
    trust: TRUST.ESTIMATED,
    mode,
    origin,
    destination,
    distanceKm,
    durationMinutes,
    geometry: line(origin, destination),
    notes: 'Straight-line geometric estimate. Not a turn-by-turn verified route.',
  };
}

function compare(origin, destination) {
  const modes = ['walking', 'driving', 'transit'];
  const options = modes.map((mode) => plan({ origin, destination, mode }));
  const fastest = [...options].sort((a, b) => a.durationMinutes - b.durationMinutes)[0];
  const shortest = [...options].sort((a, b) => a.distanceKm - b.distanceKm)[0];
  return {
    live: false,
    trust: TRUST.ESTIMATED,
    options,
    fastest: fastest.mode,
    shortest: shortest.mode,
    walkingFriendly: options.find((o) => o.mode === 'walking'),
  };
}

module.exports = {
  plan,
  compare,
  status: () => ({ name: 'geometric', connected: true, live: false }),
};
