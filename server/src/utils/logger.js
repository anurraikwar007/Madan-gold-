import logger from "../config/logger.js";

export const logInfo = (
  message,
  data = {}
) => {
  logger.info({
    message,
    ...data,
  });
};

export const logWarn = (
  message,
  data = {}
) => {
  logger.warn({
    message,
    ...data,
  });
};

export const logError = (
  message,
  error,
  data = {}
) => {
  logger.error({
    message,

    error:
      error?.message || error,

    stack:
      error?.stack,

    ...data,
  });
};

export default logger;