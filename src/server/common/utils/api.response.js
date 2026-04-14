class APIResponse {
  static _buildDataSummary(data) {
    if (data === null || data === undefined) return "no data";
    if (typeof data === "object") {
      if (Array.isArray(data)) return `array(length=${data.length})`;
      return `object(keys=[${Object.keys(data).join(",")}])`;
    }
    return `value(${data})`;
  }

  static created(res, message, data = null) {
    console.info(
      `[APIResponse] status=201 success=true message="${message}" data=${APIResponse._buildDataSummary(data)}`,
    );
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  }

  static success(res, message, data = null) {
    console.info(
      `[APIResponse] status=200 success=true message="${message}" data=${APIResponse._buildDataSummary(data)}`,
    );
    return res.status(200).json({
      success: true,
      message,
      data,
    });
  }
}

export default APIResponse;
