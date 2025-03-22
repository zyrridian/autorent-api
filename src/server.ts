import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import authRoutes from "./modules/auth/auth.routes";
import carRoutes from "./modules/car/car.routes";
import rentalRoutes from "./modules/rentals/rental.routes";
import paymentRoutes from "./modules/payments/payment.routes";
import { setupSwagger } from "./config/swagger";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());

// Swagger Docs
setupSwagger(app);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/payments", paymentRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
