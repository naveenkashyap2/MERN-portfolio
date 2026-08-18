import Tabs from '../../../components/ui/Tabs.jsx';

export default function TransportSelector({ value, onChange }) {
  return (
    <Tabs
      value={value}
      onChange={onChange}
      tabs={[
        { id: 'train', label: 'Train' },
        { id: 'bus', label: 'Bus' },
        { id: 'local', label: 'Local' },
      ]}
    />
  );
}
