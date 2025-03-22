import { midtrans } from "../../config/midtrans";
import { db } from "../../db/db";
import { rentals, users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { desc } from "drizzle-orm";
import { transactions } from "../../db/schema";
import { sendEmail } from "../../config/email";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

export async function createPayment(
  userId: number,
  rentalId: number,
  amount: number
) {
  const rental = await db
    .select()
    .from(rentals)
    .where(eq(rentals.id, rentalId))
    .limit(1);

  if (!rental.length) throw new Error("Rental not found");

  const orderId = `RENTAL-${rentalId}-${Date.now()}`;

  const parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: amount,
    },
    customer_details: {
      user_id: userId,
    },
  };

  // Create transaction in Midtrans
  const transaction = await midtrans.createTransaction(parameter);

  // Save transaction details in the database
  await db.insert(transactions).values({
    userId,
    rentalId,
    orderId,
    amount,
    status: "pending",
    paymentType: "midtrans", // You may update this dynamically later
  });

  return { orderId, paymentUrl: transaction.redirect_url };
}

export async function saveTransaction(
  userId: number,
  rentalId: number,
  orderId: string,
  amount: number
) {
  await db.insert(transactions).values({
    userId,
    rentalId,
    orderId,
    amount,
    status: "pending",
  });
}

export async function handlePaymentNotification(data: any) {
  const { order_id, transaction_status, payment_type } = data;

  // Find the transaction in DB
  const existingTransaction = await db
    .select()
    .from(transactions)
    .where(eq(transactions.orderId, order_id))
    .limit(1);
  if (!existingTransaction.length) throw new Error("Transaction not found");

  let updatedStatus = "pending";
  if (transaction_status === "settlement") updatedStatus = "paid";
  else if (
    transaction_status === "cancel" ||
    transaction_status === "deny" ||
    transaction_status === "expire"
  )
    updatedStatus = "failed";

  // Update transaction status in DB
  await db
    .update(transactions)
    .set({ status: updatedStatus, paymentType: payment_type })
    .where(eq(transactions.orderId, order_id));

  // Get user email
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, existingTransaction[0].userId))
    .limit(1);
  if (!user.length) return;

  // Send email notification
  const emailText =
    updatedStatus === "paid"
      ? `Your payment for order ${order_id} was successful.`
      : `Your payment for order ${order_id} failed. Please try again.`;

  await sendEmail(user[0].email, "Payment Update", emailText);
}

export function verifyMidtransSignature(data: any): boolean {
  const { order_id, status_code, gross_amount, signature_key } = data;

  // Recalculate expected signature
  const expectedSignature = crypto
    .createHash("sha512")
    .update(
      order_id + status_code + gross_amount + process.env.MIDTRANS_SERVER_KEY
    )
    .digest("hex");

  return expectedSignature === signature_key;
}

export async function getUserPayments(userId: number) {
  return await db
    .select()
    .from(transactions)
    .where(eq(transactions.userId, userId))
    .orderBy(desc(transactions.createdAt));
}

export async function getAllPayments(status?: string) {
  let query = db
    .select()
    .from(transactions)
    .orderBy(desc(transactions.createdAt));

  // ✅ Instead of reassigning `query`, chain `.where(...)` correctly
  if (status) {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.status, status))
      .orderBy(desc(transactions.createdAt));
  }

  return await query;
}
