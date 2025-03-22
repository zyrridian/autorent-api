import { db } from "../../db/db";
import { rentals, cars } from "../../db/schema";
import { eq } from "drizzle-orm";

export async function bookCar(
  userId: number,
  carId: number,
  startDate: Date,
  endDate: Date
) {
  const car = await db.select().from(cars).where(eq(cars.id, carId));
  if (car.length === 0) throw new Error("Car not found");

  const days = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (days <= 0) throw new Error("Invalid rental period");

  const totalPrice = days * car[0].pricePerDay;

  const [rental] = await db
    .insert(rentals)
    .values({
      userId,
      carId,
      startDate,
      endDate,
      totalPrice,
    })
    .returning();

  return rental;
}

export async function returnCar(rentalId: number) {
  const rental = await db
    .select()
    .from(rentals)
    .where(eq(rentals.id, rentalId));
  if (rental.length === 0) throw new Error("Rental not found");

  await db.delete(rentals).where(eq(rentals.id, rentalId));
  return { message: "Car returned successfully" };
}

export async function getUserRentals(userId: number) {
  return await db.select().from(rentals).where(eq(rentals.userId, userId));
}
