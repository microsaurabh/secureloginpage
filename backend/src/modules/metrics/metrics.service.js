const startedAt = Date.now();
const counters = { requests: 0, errors: 0 };

export const metricsService = {
  recordResponse(statusCode) {
    counters.requests += 1;
    if (statusCode >= 500) counters.errors += 1;
  },
  snapshot() {
    return {
      uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
      requests: counters.requests,
      errors: counters.errors
    };
  }
};
