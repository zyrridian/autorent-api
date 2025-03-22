import express, { RequestHandler } from "express";
import * as carController from "./car.controller";
import { validateCar } from "./car.validation";
import { authMiddleware } from "../auth/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  validateCar as RequestHandler[],
  carController.addCar
);
router.get("/", carController.getAllCars);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  validateCar as RequestHandler[],
  carController.updateCar
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  carController.deleteCar
);

export default router;
