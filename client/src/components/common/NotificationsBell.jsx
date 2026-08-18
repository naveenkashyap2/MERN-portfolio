import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, CheckCheck, Trash2, CalendarClock, MapPin, Wallet, TrainFront, Sparkles } from 'lucide-react';
import { api } from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import Drawer from '../ui/Drawer';
import { cn } from '../../utils/cn';

const TYPE_ICONS = {
  trip_reminder: CalendarClock,
  arrival: MapPin,
  budget_warning: Wallet,
  transport_update: TrainFront,
  ai_recommendation: Sparkles,
  system: Bell,
};

export default function NotificationsBell() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get('/notifications').then((r) => r.data.data),
    enabled: isAuthenticated,
  });

  const markAll = useMutation({
    mutationFn: () => api.patch('/notifications/read-all'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const notifications = data?.notifications || [];
  const unread = data?.unread || 0;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative p-2.5 rounded-xl text-muted hover:text-body hover:bg-white/[0.06] transition-colors"
        aria-label={`Notifications${unread ? ` (${unread} unread)` : ''}`}
      >
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-brand-500 text-[10px] font-semibold text-white flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      <Drawer open={open} onClose={() => setOpen(false)} title="Notifications" side="right">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-muted">{unread > 0 ? `${unread} unread` : 'All caught up'}</p>
          {notifications.length > 0 && (
            <button onClick={() => markAll.mutate()} className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
              <CheckCheck size={13} /> Mark all read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <p className="text-sm text-muted text-center py-10">Nothing here yet.</p>
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => {
              const Icon = TYPE_ICONS[n.type] || Bell;
              return (
                <div
                  key={n.id}
                  className={cn('rounded-xl border p-3.5 flex gap-3', n.read ? 'border-white/[0.06] bg-white/[0.02]' : 'border-brand-500/20 bg-brand-500/[0.06]')}
                >
                  <Icon size={18} className={cn('mt-0.5 shrink-0', n.read ? 'text-muted' : 'text-brand-400')} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-body">{n.title}</p>
                    {n.body && <p className="text-xs text-muted mt-0.5">{n.body}</p>}
                  </div>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-brand-400 shrink-0 mt-1.5" />}
                </div>
              );
            })}
          </div>
        )}
      </Drawer>
    </>
  );
}
