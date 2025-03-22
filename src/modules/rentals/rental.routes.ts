import express, { RequestHandler } from "express";
import {
  handleBookCar,
  handleReturnCar,
  handleGetUserRentals,
} from "./rental.controller";
import { validateRental } from "./rental.validation";
import { authMiddleware } from "../auth/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validateRental as RequestHandler[],
  handleBookCar
);
router.delete("/:rentalId", authMiddleware, handleReturnCar);
router.get(
  "/",
  authMiddleware,
  roleMiddleware("employee"),
  handleGetUserRentals
);

export default router;
