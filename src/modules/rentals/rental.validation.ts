import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateRental = [
  body("carId").isInt().withMessage("Car ID must be a number"),
  body("startDate").isISO8601().withMessage("Invalid start date"),
  body("endDate").isISO8601().withMessage("Invalid end date"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
];
