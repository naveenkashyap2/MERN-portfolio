import PlacePreferences from '../../planner/components/PlacePreferences.jsx';
import TravelStyle from '../../planner/components/TravelStyle.jsx';
import StaySelector from '../../planner/components/StaySelector.jsx';
import Button from '../../../components/ui/Button.jsx';

export default function TravelPreferences({ value, onChange, onSave }) {
  return (
    <div className="space-y-6">
      <TravelStyle value={value.preferredTransport || 'any'} onChange={(preferredTransport) => onChange({ ...value, preferredTransport })} />
      <StaySelector value={value.preferredHotel || 'medium'} onChange={(preferredHotel) => onChange({ ...value, preferredHotel })} />
      <PlacePreferences value={value.interests || []} onChange={(interests) => onChange({ ...value, interests })} />
      <Button onClick={onSave}>Save preferences</Button>
    </div>
  );
}
