class APIResponse {
  static created(res, message, data = null) {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  }

  static success(res, message, data = null) {
    return res.status(200).json({
      success: true,
      message,
      data,
    });
  }
}

export default APIResponse;
