import TransportCard from './TransportCard.jsx';

export default function TrainResults({ data }) {
  if (!data) return null;
  if (!data.items?.length) {
    return (
      <TransportCard
        title="Trains"
        subtitle={`${data.estimate?.distanceKm || '—'} km corridor`}
        duration={data.estimate?.typicalDuration}
        fare={data.estimate?.typicalFareRange}
        trust={data.trust}
        message={data.message}
      />
    );
  }
  return data.items.map((t) => (
    <TransportCard key={t.id} title={t.name} subtitle={t.number} duration={t.duration} fare={t.fare} trust="LIVE VERIFIED" />
  ));
}
