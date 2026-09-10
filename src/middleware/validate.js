import AppError from "../errors/AppError.js";

export const validate =
  (schema, source = "body") =>
  (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const details = result.error.issues.map((issue) => issue.message);

      throw new AppError("Validation failed", 400, details);
    }

    if (source === "body") {
      req.body = result.data;
    } else {
      res.locals.validatedQuery = result.data;
    }

    next();
  };
