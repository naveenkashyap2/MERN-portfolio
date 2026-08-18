import DestinationInput from './DestinationInput.jsx';
import BudgetSelector from './BudgetSelector.jsx';
import TravelStyle from './TravelStyle.jsx';
import StaySelector from './StaySelector.jsx';
import PlacePreferences from './PlacePreferences.jsx';
import TravelerSelector from './TravelerSelector.jsx';
import Input from '../../../components/ui/Input.jsx';
import { daysBetween } from '../../../utils/date.js';

const STEPS = ['Destination', 'Dates', 'Travelers', 'Budget', 'Transport', 'Stay', 'Interests'];

export default function TripPlannerForm({ step, draft, setDraft }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-ink-mute">
        0{step + 1} {STEPS[step]}
      </p>
      <div className="mt-5">
        {step === 0 && <DestinationInput draft={draft} setDraft={setDraft} />}
        {step === 1 && (
          <div className="space-y-4">
            <Input label="Start date" type="date" value={draft.startDate} onChange={(e) => setDraft({ ...draft, startDate: e.target.value })} />
            <Input label="End date" type="date" min={draft.startDate} value={draft.endDate} onChange={(e) => setDraft({ ...draft, endDate: e.target.value })} />
            {draft.startDate && draft.endDate && (
              <p className="text-sm text-ink-mute">
                {daysBetween(draft.startDate, draft.endDate)} Days / {Math.max(0, daysBetween(draft.startDate, draft.endDate) - 1)} Night
              </p>
            )}
          </div>
        )}
        {step === 2 && <TravelerSelector value={draft.travelers} onChange={(travelers) => setDraft({ ...draft, travelers })} />}
        {step === 3 && <BudgetSelector value={draft.budget} onChange={(budget) => setDraft({ ...draft, budget })} />}
        {step === 4 && <TravelStyle value={draft.transportPreference} onChange={(transportPreference) => setDraft({ ...draft, transportPreference })} />}
        {step === 5 && <StaySelector value={draft.stayPreference} onChange={(stayPreference) => setDraft({ ...draft, stayPreference })} />}
        {step === 6 && <PlacePreferences value={draft.interests} onChange={(interests) => setDraft({ ...draft, interests })} />}
      </div>
    </div>
  );
}
