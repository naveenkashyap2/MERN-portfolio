/**
 * Zod-powered request validation. Usage:
 *   validate({ body: schema, params: schema, query: schema })
 *
 * Rejects unknown fields, invalid types, oversized strings, etc. and returns
 * structured, friendly issues through the error middleware.
 */
export function validate({ body, params, query }) {
  return (req, _res, next) => {
    try {
      if (body) req.body = body.parse(req.body);
      if (params) req.params = params.parse(req.params);
      if (query) req.query = query.parse(req.query);
      next();
    } catch (err) {
      next(err);
    }
  };
}

export default validate;
