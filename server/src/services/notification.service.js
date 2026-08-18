const Notification = require('../models/Notification');
const { ApiError } = require('../utils/ApiError');
const { objectId } = require('../utils/validate');
const { paginate, pageResult } = require('../utils/pagination');

async function list(req) {
  const { page, limit, skip } = paginate(req.query);
  const filter = { userId: req.user._id };
  const [items, total] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Notification.countDocuments(filter),
  ]);
  const unread = await Notification.countDocuments({ userId: req.user._id, readAt: null });
  return { ...pageResult(items, total, page, limit), unread };
}

async function markRead(req) {
  objectId(req.params.notificationId, 'notificationId');
  const item = await Notification.findOne({ _id: req.params.notificationId, userId: req.user._id });
  if (!item) throw new ApiError(404, 'Notification not found.', { code: 'NOT_FOUND' });
  item.readAt = new Date();
  await item.save();
  return { notification: item };
}

async function markAll(req) {
  await Notification.updateMany({ userId: req.user._id, readAt: null }, { $set: { readAt: new Date() } });
  return { ok: true };
}

async function remove(req) {
  objectId(req.params.notificationId, 'notificationId');
  const item = await Notification.findOne({ _id: req.params.notificationId, userId: req.user._id });
  if (!item) throw new ApiError(404, 'Notification not found.', { code: 'NOT_FOUND' });
  await item.deleteOne();
  return { ok: true };
}

async function push(userId, payload) {
  return Notification.create({ userId, ...payload });
}

module.exports = { list, markRead, markAll, remove, push };
