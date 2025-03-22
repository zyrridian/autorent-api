import { Request, Response } from "express";
import { bookCar, returnCar, getUserRentals } from "./rental.service";

export async function handleBookCar(req: Request, res: Response) {
  try {
    const { carId, startDate, endDate } = req.body;
    const userId = (req as any).user.id;
    const rental = await bookCar(
      userId,
      carId,
      new Date(startDate),
      new Date(endDate)
    );
    res.status(201).json({ message: "Car booked successfully", rental });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function handleReturnCar(req: Request, res: Response) {
  try {
    const { rentalId } = req.params;
    const result = await returnCar(Number(rentalId));
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function handleGetUserRentals(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    const rentals = await getUserRentals(userId);
    res.status(200).json(rentals);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}
