const cache = new Map(); 

const cacheMiddleware = (duration) => (req, res, next) => {
  const key = req.originalUrl;

  if (cache.has(key)) {
    return res.json(cache.get(key));
  }

  res.originalJson = res.json;
  res.json = (body) => {
    cache.set(key, body);
    setTimeout(() => cache.delete(key), duration * 1000);
    res.originalJson(body);
  };
  next();
};

module.exports = cacheMiddleware;