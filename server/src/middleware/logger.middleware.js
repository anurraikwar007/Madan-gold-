import logger from "../config/logger.js";

const loggerMiddleware = (req, res, next) => {
  const startTime = process.hrtime.bigint();

  res.on("finish", () => {
    const endTime = process.hrtime.bigint();

    const responseTime =
      Number(endTime - startTime) / 1_000_000;

    logger.info({
      requestId: req.requestId,

      timestamp: new Date().toISOString(),

      method: req.method,

      url: req.originalUrl,

      statusCode: res.statusCode,

      responseTime: `${responseTime.toFixed(2)} ms`,

      ip:
        req.clientIp ||
        req.ip,

      userAgent:
        req.userAgent ||
        req.headers["user-agent"],

      contentLength:
        res.getHeader("content-length") || 0,

      referrer:
        req.headers.referer ||
        null,

      host:
        req.hostname,

      protocol:
        req.protocol,

      query:
        req.query,

      params:
        req.params,

      authenticatedUser:
      req.user?._id ||
      null,

    role:
      req.user?.role ||
      "Guest",
    });
  });

  next();
};

export default loggerMiddleware;