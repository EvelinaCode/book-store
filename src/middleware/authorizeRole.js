import AppError from "../errors/AppError.js";

const VALID_ROLES = ["USER", "ADMIN"];

export function authorizeRole(...allowedRoles) {
  if (
    allowedRoles.length === 0 ||
    !allowedRoles.every((role) => VALID_ROLES.includes(role))
  ) {
    throw new Error("Invalid authorization role configuration");
  }

  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Authentication required", 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError("Forbidden", 403));
    }

    next();
  };
}
