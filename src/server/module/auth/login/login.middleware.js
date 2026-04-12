import APIError from "../../../common/utils/api.error";

const checkEmptyParams = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    APIError.badRequest("Please enter your mail address or password");
  }
};

export default checkEmptyParams;
