import { Request, Response } from "express";
import {
  createPayment,
  getAllPayments,
  getUserPayments,
  handlePaymentNotification,
  verifyMidtransSignature,
} from "./payment.service";

export async function payment(req: Request, res: Response) {
  try {
    const { rentalId, amount } = req.body;
    const userId = (req as any).user.id;
    const payment = await createPayment(userId, rentalId, amount);
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function paymentNotification(
  req: Request,
  res: Response
): Promise<any> {
  try {
    if (!verifyMidtransSignature(req.body)) {
      return res.status(403).json({ error: "Invalid signature" });
    }
    await handlePaymentNotification(req.body);

    return res.status(200).json({ message: "Payment status updated" });
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
}

export async function paymentHistory(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    const payments = await getUserPayments(userId);
    res.status(200).json({ payments });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function allPayment(req: Request, res: Response) {
  try {
    const { status } = req.query; // Optional status filter
    const payments = await getAllPayments(status as string | undefined);

    res.status(200).json({ payments });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}
