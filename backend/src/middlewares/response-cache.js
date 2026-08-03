const entries = new Map();

export function responseCache(ttlMs) {
  return (req, res, next) => {
    const key = `${req.originalUrl}:${req.auth?.sub ?? 'anonymous'}`;
    const cached = entries.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      res.setHeader('x-cache', 'HIT');
      return res.status(cached.status).json(cached.body);
    }

    const sendJson = res.json.bind(res);
    res.json = (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        entries.set(key, { body, status: res.statusCode, expiresAt: Date.now() + ttlMs });
      }
      res.setHeader('x-cache', 'MISS');
      return sendJson(body);
    };
    next();
  };
}

export function invalidateResponseCache() {
  entries.clear();
}
