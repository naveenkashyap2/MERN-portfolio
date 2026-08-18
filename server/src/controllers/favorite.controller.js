import { store } from '../store/index.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ok, created } from '../utils/ApiResponse.js';
import { newId } from '../store/memory.js';

/** POST /api/v1/favorites */
export const create = asyncHandler(async (req, res) => {
  const { type, refId, snapshot } = req.body;
  const existing = store.favorites.findByUserAndRef(req.user.id, type, refId);
  if (existing) return ok(res, { favorite: existing, created: false });

  const favorite = {
    id: newId('fav'),
    userId: req.user.id,
    type,
    refId,
    snapshot: snapshot || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.favorites.insert(favorite);
  return created(res, { favorite, created: true });
});

/** GET /api/v1/favorites */
export const list = asyncHandler(async (req, res) => {
  const type = req.query.type;
  let favorites = store.favorites.filter((f) => f.userId === req.user.id);
  if (type) favorites = favorites.filter((f) => f.type === type);
  favorites.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  return ok(res, { favorites });
});

/** DELETE /api/v1/favorites/:favoriteId */
export const remove = asyncHandler(async (req, res) => {
  const favorite = store.favorites.findById(req.params.favoriteId);
  if (!favorite || favorite.userId !== req.user.id) return ok(res, { message: 'Removed.' });
  store.favorites.remove(favorite.id);
  return ok(res, { message: 'Removed.' });
});

/** GET /api/v1/favorites/check/:placeId */
export const check = asyncHandler(async (req, res) => {
  const favorite = store.favorites.findByUserAndRef(req.user.id, 'place', req.params.placeId);
  return ok(res, { saved: Boolean(favorite), favoriteId: favorite?.id || null });
});
