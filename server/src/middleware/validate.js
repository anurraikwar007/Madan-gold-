const validate = (schema) => {
  return (req, res, next) => {
    const errors = [];

    // Validate Body
    if (schema.body) {
      const {
        error,
        value,
      } = schema.body.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (!error) {
        req.body = value;
      }

      if (error) {
        errors.push(...error.details.map((item) => item.message));
      }
    }

    // Validate Params
    if (schema.params) {
      const {
        error,
        value,
      } =
        schema.params.validate(req.params, {
          abortEarly: false,
          stripUnknown: true,
        });

      if (!error) {
        req.params = value;
      }

      if (error) {
        errors.push(...error.details.map((item) => item.message));
      }
    }

    // Validate Query
    if (schema.query) {
      const {
        error,
        value,
      } =
    schema.query.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

  if (!error) {
    Object.keys(req.query).forEach((key) => {
      delete req.query[key];
    });

    Object.assign(req.query, value);
  }

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