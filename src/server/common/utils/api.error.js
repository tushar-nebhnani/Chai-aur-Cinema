class APIError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
  static notFound(message = "Required data not found") {
    return new APIError(404, message);
  }

  static failedService(message = "Service failed.") {
    return new APIError(503, message);
  }

  static conflict(message = "Duplication found.") {
    return new APIError(409, message);
  }

  static notAuthorised(message = "user failed to authenticate") {
    return new APIError(401, message);
  }

  static serverError(message = "Server not responding.") {
    return new APIError(500, message);
  }
}

export default APIError;
