import AuditLog from "../models/auditLog.model.js";

class AuditService {
  async log({
    entityType,
    entityId,
    action,

    performedBy,
    performedByModel = "Admin",

    changes = [],
    reason = "",
    ipAddress = "",
    userAgent = "",
    requestId = "",
    metadata = {},
  }) {
    return AuditLog.create({
      entityType,
      entityId,
      action,

      performedBy,
      performedByModel,

      changes,
      reason,
      ipAddress,
      userAgent,
      requestId,
      metadata,
    });
  }
}

export default new AuditService();