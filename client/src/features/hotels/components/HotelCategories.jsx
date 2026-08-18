import Tabs from '../../../components/ui/Tabs.jsx';

export default function HotelCategories({ value, onChange }) {
  return (
    <Tabs
      value={value}
      onChange={onChange}
      tabs={[
        { id: 'all', label: 'All' },
        { id: 'budget', label: 'Budget' },
        { id: 'medium', label: 'Medium' },
        { id: 'premium', label: 'Premium' },
      ]}
    />
  );
}
