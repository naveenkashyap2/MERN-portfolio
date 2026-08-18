import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import { useTrip } from '../../features/trips/hooks/useTrip.js';
import { tripsApi } from '../../features/trips/trips.api.js';
import { toast } from '../../store/ui.store.js';

export default function EditTrip() {
  const { tripId } = useParams();
  const { data: trip } = useTrip(tripId);
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (trip) {
      setForm({
        title: trip.title,
        budget: trip.budget,
        status: trip.status,
      });
    }
  }, [trip]);

  if (!form) {
    return (
      <DashboardLayout>
        <p>Planning your journey...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-semibold">Edit trip</h1>
      <form
        className="card mt-6 max-w-lg space-y-4 p-6"
        onSubmit={async (e) => {
          e.preventDefault();
          await tripsApi.update(tripId, form);
          toast('Trip updated successfully.', 'success');
          navigate(`/trips/${tripId}`);
        }}
      >
        <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <Input label="Budget" type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })} />
        <label className="block">
          <span className="label">Status</span>
          <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="draft">Draft</option>
            <option value="planned">Planned</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </label>
        <Button type="submit">Save</Button>
      </form>
    </DashboardLayout>
  );
}
