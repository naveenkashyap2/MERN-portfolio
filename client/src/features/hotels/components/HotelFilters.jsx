import Input from '../../../components/ui/Input.jsx';

export default function HotelFilters({ city, onCity }) {
  return <Input label="City" value={city} onChange={(e) => onCity(e.target.value)} placeholder="Agra" />;
}
