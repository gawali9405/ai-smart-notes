import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/User.js";
import { env } from "../config/env.js";

export const protect = asyncHandler(async (req, _res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new ApiError(401, "Not authorized");
  }

  try {
    const decoded = jwt.verify(token, env.jwt.secret);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) throw new ApiError(401, "User no longer exists");
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid token");
  }
});

export const authorize =
  (...roles) =>
    (req, _res, next) => {
      if (!roles.includes(req.user.role)) {
        throw new ApiError(403, "Forbidden");
      }
      next();
    };
