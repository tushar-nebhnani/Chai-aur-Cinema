import Joi from "joi";

class BaseDTO {
  static schema = Joi.object({}); // every single dto data will go here

  static validate(data) {
    const { error, value } = this.schema.validate(data, {
      abortEarly: false, // ensure that joi does the validation for everything
      stripUnknown: true, // remove the unknown fields which are not present in the schema.
    });

    if (error) {
      const errors = error.details.map((d) => d.message);
      return { errors, value: null };
    }

    return { error: null, value };
  }
}

export default BaseDTO;
