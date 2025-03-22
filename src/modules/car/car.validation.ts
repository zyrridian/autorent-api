import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateCar = [
  body("brand").notEmpty().withMessage("Brand is required"),
  body("model").notEmpty().withMessage("Model is required"),
  body("year")
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage("Invalid year"),
  body("pricePerDay")
    .isInt({ min: 1 })
    .withMessage("Price per day must be greater than 0"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
];
