import { errorResponse } from "../utils/response.js";

export const notFoundHandler = (req, res, _next) =>
  errorResponse(res, {
    status: 404,
    message: `Route ${req.originalUrl} not found`,
  });
