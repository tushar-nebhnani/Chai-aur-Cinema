import APIError from "../utils/api.error.js";

const validate = (DTOclass) => {
  return (req, res, next) => {
    const { errors, value } = DTOclass.validate(req.body);
    if (errors) {
      throw APIError.badRequest(errors.join("; "));
    }

    if (!value || Object.keys(value).length === 0) {
      throw APIError.badRequest("Request body is missing or invalid.");
    }

    req.body = value;
    next();
  };
};

export default validate;
