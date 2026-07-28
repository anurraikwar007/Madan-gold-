const validate = (schema) => {
  return (req, res, next) => {
    const errors = [];

    // Validate Body
    if (schema.body) {
      const { error } = schema.body.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        errors.push(...error.details.map((item) => item.message));
      }
    }

    // Validate Params
    if (schema.params) {
      const { error } = schema.params.validate(req.params, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        errors.push(...error.details.map((item) => item.message));
      }
    }

    // Validate Query
    if (schema.query) {
      const { error } = schema.query.validate(req.query, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        errors.push(...error.details.map((item) => item.message));
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors,
      });
    }

    next();
  };
};

export default validate;