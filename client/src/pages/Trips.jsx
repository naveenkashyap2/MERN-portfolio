import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Route as RouteIcon, Plus, Copy, Share2, Link as LinkIcon, MessageCircle, Mail, Check } from 'lucide-react';
import { tripsApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import Tabs from '../components/ui/Tabs';
import TripCard from '../components/travel/TripCard';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { CardSkeleton } from '../components/ui/Skeleton';

const TABS = [
  { value: 'all', label: 'All Trips' },
  { value: 'planned', label: 'Upcoming' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

export default function Trips() {
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('all');
  const [shareTrip, setShareTrip] = useState(null);
  const [deleteTrip, setDeleteTrip] = useState(null);
  const [copied, setCopied] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['trips'],
    queryFn: () => tripsApi.list(),
  });

  const duplicate = useMutation({
    mutationFn: (id) => tripsApi.duplicate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      toast.success('Trip duplicated.');
    },
  });

  const remove = useMutation({
    mutationFn: (id) => tripsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      toast.success('Trip deleted.');
      setDeleteTrip(null);
    },
  });

  const share = useMutation({
    mutationFn: (id) => tripsApi.share(id),
    onSuccess: (res) => {
      const link = `${window.location.origin}/trips/${res.trip.id}`;
      setShareTrip({ ...res, link });
    },
  });

  const trips = (data?.trips || []).filter((t) => tab === 'all' || t.status === tab);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareTrip.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error('Could not copy the link.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">My Trips</h1>
          <p className="text-muted mt-1 text-sm">{data?.total || 0} trips planned</p>
        </div>
        <Button icon={Plus} onClick={() => navigate('/plan')}>New Trip</Button>
      </div>

      <Tabs tabs={TABS} value={tab} onChange={setTab} className="mb-6" />

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : trips.length === 0 ? (
        <EmptyState
          icon={RouteIcon}
          title="Your next adventure starts here."
          description="No trips in this view yet — create an AI trip and let YatraGenie plan it for you."
          actionLabel="Create AI Trip"
          actionIcon={Plus}
          onAction={() => navigate('/plan')}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trips.map((t, i) => (
            <TripCard
              key={t.id}
              trip={t}
              index={i}
              onEdit={() => navigate(`/trips/${t.id}`)}
              onDuplicate={() => duplicate.mutate(t.id)}
              onDelete={() => setDeleteTrip(t)}
              onShare={() => share.mutate(t.id)}
            />
          ))}
        </div>
      )}

      {/* Share modal */}
      <Modal open={Boolean(shareTrip)} onClose={() => setShareTrip(null)} title="Share your journey" subtitle="View only — your private data stays private.">
        {shareTrip && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex-1 truncate rounded-xl bg-ink-800 border border-white/10 px-3 py-2.5 text-sm text-muted">{shareTrip.link}</div>
              <Button size="sm" variant="secondary" icon={copied ? Check : LinkIcon} onClick={copyLink}>{copied ? 'Copied' : 'Copy'}</Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <a href={`https://wa.me/?text=${encodeURIComponent(`Check out my trip: ${shareTrip.link}`)}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 h-10 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-body hover:bg-white/[0.08]">
                <MessageCircle size={15} className="text-success" /> WhatsApp
              </a>
              <a href={`mailto:?subject=My trip&body=${encodeURIComponent(shareTrip.link)}`} className="flex items-center justify-center gap-2 h-10 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-body hover:bg-white/[0.08]">
                <Mail size={15} className="text-brand-400" /> Email
              </a>
            </div>
            <p className="text-xs text-muted flex items-center gap-1.5"><Share2 size={12} /> Anyone with the link gets view-only access.</p>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTrip)}
        onClose={() => setDeleteTrip(null)}
        onConfirm={() => remove.mutate(deleteTrip.id)}
        loading={remove.isPending}
        title="Delete this trip?"
        description={`"${deleteTrip?.title}" and its expenses will be permanently removed.`}
        confirmLabel="Delete Trip"
      />
    </div>
  );
}
