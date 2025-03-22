import { db } from "../../db/db";
import { cars } from "../../db/schema";
import { desc, sql } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { redis } from "../../../redis";

export async function addCar(
  brand: string,
  model: string,
  year: number,
  pricePerDay: number
) {
  await db.insert(cars).values({ brand, model, year, pricePerDay });
  return { message: "Car added successfully" };
}

export async function getAllCars(page: number = 1, limit: number = 10) {
  // const cacheKey = `cars_page_${page}_limit_${limit}`;
  // const cachedData = await redis.get(cacheKey);

  // if (cachedData) {
  //   return JSON.parse(cachedData);
  // }

  const offset = (page - 1) * limit;
  const results = await db
    .select()
    .from(cars)
    .orderBy(desc(cars.createdAt))
    .limit(limit)
    .offset(offset);

  const total = await db.select({ count: sql<number>`COUNT(*)` }).from(cars);

  const response = {
    data: results,
    total: total[0].count,
    page,
    totalPages: Math.ceil(total[0].count / limit),
  };

  // await redis.setex(cacheKey, 3600, JSON.stringify(response)); // Cache for 1 hour
  return response;
}

export async function updateCar(
  id: number,
  brand?: string,
  model?: string,
  year?: number,
  pricePerDay?: number
) {
  const car = await db.select().from(cars).where(eq(cars.id, id));
  if (car.length === 0) throw new Error("Car not found");

  await db
    .update(cars)
    .set({ brand, model, year, pricePerDay })
    .where(eq(cars.id, id));
  return { message: "Car updated successfully" };
}

export async function deleteCar(id: number) {
  const car = await db.select().from(cars).where(eq(cars.id, id));
  if (car.length === 0) throw new Error("Car not found");

  await db.delete(cars).where(eq(cars.id, id));
  return { message: "Car deleted successfully" };
}
