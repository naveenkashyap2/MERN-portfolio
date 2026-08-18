import Tabs from '../../../components/ui/Tabs.jsx';
import { PLACE_CATEGORIES } from '../../../constants/places.js';

export default function PlaceFilters({ value, onChange }) {
  return (
    <Tabs
      value={value}
      onChange={onChange}
      tabs={PLACE_CATEGORIES.map((c) => ({ id: c, label: c[0].toUpperCase() + c.slice(1) }))}
    />
  );
}
