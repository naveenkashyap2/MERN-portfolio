import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import TransportSelector from '../../features/transport/components/TransportSelector.jsx';
import TrainResults from '../../features/transport/components/TrainResults.jsx';
import BusResults from '../../features/transport/components/BusResults.jsx';
import WalkingRoute from '../../features/transport/components/WalkingRoute.jsx';
import RouteComparison from '../../features/transport/components/RouteComparison.jsx';
import { transportApi } from '../../features/transport/transport.api.js';

export default function Transport() {
  const [tab, setTab] = useState('train');
  const [from, setFrom] = useState('Delhi');
  const [to, setTo] = useState('Agra');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [trains, setTrains] = useState(null);
  const [buses, setBuses] = useState(null);
  const [walk, setWalk] = useState(null);
  const [cmp, setCmp] = useState(null);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setLoading(true);
    try {
      const [t, b, c, w] = await Promise.all([
        transportApi.trains({ from, to, date }),
        transportApi.buses({ from, to, date }),
        transportApi.compare({ origin: from, destination: to }),
        transportApi.walking({ origin: from, destination: to }),
      ]);
      setTrains(t);
      setBuses(b);
      setCmp(c);
      setWalk(w);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-semibold">Transport</h1>
      <p className="mt-1 text-sm text-ink-mute">LIVE VERIFIED only appears when a provider answers. Otherwise you will see estimates.</p>
      <div className="mt-6 grid gap-3 md:grid-cols-4">
        <Input label="From" value={from} onChange={(e) => setFrom(e.target.value)} />
        <Input label="To" value={to} onChange={(e) => setTo(e.target.value)} />
        <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <div className="flex items-end">
          <Button className="w-full" loading={loading} onClick={search}>
            Search
          </Button>
        </div>
      </div>
      <div className="mt-6">
        <TransportSelector value={tab} onChange={setTab} />
      </div>
      <div className="mt-6 space-y-4">
        {tab === 'train' && <TrainResults data={trains} />}
        {tab === 'bus' && <BusResults data={buses} />}
        {tab === 'local' && <WalkingRoute route={walk} />}
      </div>
      <div className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">Compare</h2>
        <RouteComparison data={cmp} />
      </div>
    </DashboardLayout>
  );
}
