import { apiResponse } from "../utils/apiResponse.js";

const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    // Auth middleware se req.user set hona chahiye
    if (!req.user) {
      return res
        .status(401)
        .json(apiResponse.error("Unauthorized."));
    }

    const userRole = req.user.role;

    

    if (!roles.includes(userRole)) {
      return res
        .status(403)
        .json(apiResponse.error("Access denied."));
    }

    next();
  };
};

export default roleMiddleware;