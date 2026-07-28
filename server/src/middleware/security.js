import helmet from "helmet";
import compression from "compression";

const securityMiddleware = [
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },

    contentSecurityPolicy: false,
  }),

  compression({
    threshold: 1024,
  }),
];

export default securityMiddleware;