import APIError from "../../../common/utils/api.error.js";

const checkEmptyParams = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw APIError.badRequest("Please enter your mail address or password");
  }

  next();
};

export default checkEmptyParams;
