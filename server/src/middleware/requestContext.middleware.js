import { v4 as uuid } from "uuid";

const requestContext = (req, res, next) => {
  // =====================================================
  // Request Identification
  // =====================================================

  req.requestId = uuid();

  req.requestStartTime = Date.now();

  req.requestTimestamp = new Date();

  // =====================================================
  // Client Information
  // =====================================================

  req.clientIp =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    req.ip ||
    "Unknown";

  req.userAgent =
    req.headers["user-agent"] || "Unknown";

  // =====================================================
  // Request Information
  // =====================================================

  req.requestInfo = {
    id: req.requestId,

    method: req.method,

    url: req.originalUrl,

    ip: req.clientIp,

    userAgent: req.userAgent,

    timestamp: req.requestTimestamp,
  };

  // =====================================================
  // Response Headers
  // =====================================================

  res.setHeader("X-Request-Id", req.requestId);

  // =====================================================
  // Response Finish Hook
  // =====================================================

  res.on("finish", () => {
    req.responseTime = Date.now() - req.requestStartTime;
  });

  next();
};

export default requestContext;