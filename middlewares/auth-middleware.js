import ApiError from "../errors/api-error.js";
import tokenService from "../services/token-service.js";

export default function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      next(ApiError.UnauthorizedError());
    }

    const accessToken = authHeader.split(" ")[1];
    if (!accessToken) {
      next(ApiError.UnauthorizedError());
    }

    const userData = tokenService.validateAccessToken(accessToken);

    if (!userData) {
      next(ApiError.UnauthorizedError());
    }

    req.user = userData;

    next();
  } catch (e) {
    next(ApiError.UnauthorizedError());
  }
}
