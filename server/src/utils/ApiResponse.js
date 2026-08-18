function ok(res, data = {}, message = 'OK', status = 200) {
  return res.status(status).json({
    success: true,
    message,
    data,
    requestId: res.locals.requestId,
  });
}

function created(res, data = {}, message = 'Created') {
  return ok(res, data, message, 201);
}

module.exports = { ok, created };
