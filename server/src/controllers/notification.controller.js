import { store } from '../store/index.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ok } from '../utils/ApiResponse.js';

/** GET /api/v1/notifications */
export const list = asyncHandler(async (req, res) => {
  const notifications = store.notifications
    .filter((n) => n.userId === req.user.id)
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
    .slice(0, 50);
  const unread = notifications.filter((n) => !n.read).length;
  return ok(res, { notifications, unread });
});

/** PATCH /api/v1/notifications/:notificationId/read */
export const markRead = asyncHandler(async (req, res) => {
  const n = store.notifications.findById(req.params.notificationId);
  if (!n || n.userId !== req.user.id) return ok(res, { message: 'Updated.' });
  store.notifications.update(n.id, { read: true });
  return ok(res, { message: 'Marked as read.' });
});

/** PATCH /api/v1/notifications/read-all */
export const markAllRead = asyncHandler(async (req, res) => {
  store.notifications.filter((n) => n.userId === req.user.id).forEach((n) => store.notifications.update(n.id, { read: true }));
  return ok(res, { message: 'All notifications marked as read.' });
});

/** DELETE /api/v1/notifications/:notificationId */
export const remove = asyncHandler(async (req, res) => {
  const n = store.notifications.findById(req.params.notificationId);
  if (n && n.userId === req.user.id) store.notifications.remove(n.id);
  return ok(res, { message: 'Deleted.' });
});
