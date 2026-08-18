const Favorite = require('../models/Favorite');
const { ApiError } = require('../utils/ApiError');
const { assert, objectId, rejectUnknown } = require('../utils/validate');
const { paginate, pageResult } = require('../utils/pagination');

async function add(req) {
  rejectUnknown(req.body, ['type', 'placeId', 'tripId', 'title', 'subtitle', 'image', 'meta']);
  assert(req.body.type, 'type is required.');
  assert(req.body.title, 'title is required.');
  const fav = await Favorite.create({
    userId: req.user._id,
    type: req.body.type,
    placeId: String(req.body.placeId || ''),
    tripId: req.body.tripId || null,
    title: String(req.body.title).slice(0, 160),
    subtitle: String(req.body.subtitle || '').slice(0, 160),
    image: String(req.body.image || '').slice(0, 400),
    meta: req.body.meta || {},
  });
  return { favorite: fav };
}

async function list(req) {
  const { page, limit, skip } = paginate(req.query);
  const filter = { userId: req.user._id };
  if (req.query.type) filter.type = req.query.type;
  const [items, total] = await Promise.all([
    Favorite.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Favorite.countDocuments(filter),
  ]);
  return pageResult(items, total, page, limit);
}

async function remove(req) {
  objectId(req.params.favoriteId, 'favoriteId');
  const fav = await Favorite.findOne({ _id: req.params.favoriteId, userId: req.user._id });
  if (!fav) throw new ApiError(404, 'Favorite not found.', { code: 'NOT_FOUND' });
  await fav.deleteOne();
  return { ok: true };
}

async function check(req) {
  const placeId = String(req.params.placeId || '');
  assert(placeId, 'placeId is required.');
  const fav = await Favorite.findOne({ userId: req.user._id, placeId });
  return { favorited: Boolean(fav), favoriteId: fav ? String(fav._id) : null };
}

module.exports = { add, list, remove, check };
