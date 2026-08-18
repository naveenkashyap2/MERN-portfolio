function paginate({ page = 1, limit = 20, max = 50 }) {
  const p = Math.max(1, Number(page) || 1);
  const l = Math.min(max, Math.max(1, Number(limit) || 20));
  return { page: p, limit: l, skip: (p - 1) * l };
}

function pageResult(items, total, page, limit) {
  return {
    items,
    page,
    limit,
    total,
    pages: Math.max(1, Math.ceil(total / limit)),
  };
}

module.exports = { paginate, pageResult };
