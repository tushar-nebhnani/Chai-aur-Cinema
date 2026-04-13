import APIError from "../../../common/utils/api.error.js";

const checkEmptyParamsChangePass = (req, res, next) => {
  const { newPassword, oldPassword } = req.body;
  if (!newPassword || !oldPassword) {
    throw APIError.badRequest("Please enter your mail address or password");
  }

  next();
};

export default checkEmptyParamsChangePass;
