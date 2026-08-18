import TransportCard from './TransportCard.jsx';

export default function BusResults({ data }) {
  if (!data) return null;
  return (
    <TransportCard
      title="Buses"
      subtitle={`${data.estimate?.distanceKm || '—'} km corridor`}
      duration={data.estimate?.typicalDuration}
      fare={data.estimate?.typicalFareRange}
      trust={data.trust}
      message={data.message}
    />
  );
}
