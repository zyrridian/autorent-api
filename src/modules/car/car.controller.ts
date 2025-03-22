import { Request, Response } from "express";
import * as carService from "./car.service";

export async function addCar(req: Request, res: Response) {
  try {
    const { brand, model, year, pricePerDay } = req.body;
    const result = await carService.addCar(brand, model, year, pricePerDay);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function getAllCars(req: Request, res: Response): Promise<any> {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await carService.getAllCars(Number(page), Number(limit));
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

export async function updateCar(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { brand, model, year, pricePerDay } = req.body;
    const result = await carService.updateCar(
      Number(id),
      brand,
      model,
      year,
      pricePerDay
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function deleteCar(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const result = await carService.deleteCar(Number(id));
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}
