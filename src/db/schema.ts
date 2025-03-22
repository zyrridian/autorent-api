import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    role: varchar("role", { length: 50 }).notNull().default("customer"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (users) => ({
    emailIdx: index("email_idx").on(users.email),
  })
);

export const cars = pgTable("cars", {
  id: serial("id").primaryKey(),
  brand: varchar("brand", { length: 255 }).notNull(),
  model: varchar("model", { length: 255 }).notNull(),
  year: integer("year").notNull(),
  pricePerDay: integer("price_per_day").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Function to hash password before inserting into the database
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export const rentals = pgTable(
  "rentals",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    carId: integer("car_id")
      .notNull()
      .references(() => cars.id, { onDelete: "cascade" }),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    totalPrice: integer("total_price").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (rentals) => ({
    rentalUserIdx: index("rental_user_idx").on(rentals.userId),
    rentalCarIdx: index("rental_car_idx").on(rentals.carId),
  })
);

export const rentalRelations = relations(rentals, ({ one }) => ({
  user: one(users, { fields: [rentals.userId], references: [users.id] }),
  car: one(cars, { fields: [rentals.carId], references: [cars.id] }),
}));

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  orderId: varchar("order_id", { length: 100 }).notNull().unique(),
  rentalId: integer("rental_id")
    .notNull()
    .references(() => rentals.id, { onDelete: "cascade" }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  paymentType: varchar("payment_type", { length: 50 }).default("unknown"),
  createdAt: timestamp("created_at").defaultNow(),
});
