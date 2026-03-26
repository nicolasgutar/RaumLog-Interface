import { generateWompiSignature } from "./api";

export interface WompiPayload {
  amount_in_cents: number;
  currency: "COP";
  reference: string;
  integrity_signature: string;
  customer_data?: {
    email: string;
    full_name: string;
    phone_number: string;
  };
}

const WOMPI_SANDBOX_INTEGRITY_KEY = "sandbox_wompi_integrity_key_2024";
const COMMISSION_RATE = 0.20;

export const CommissionEngine = {
  getPublicPrice(desiredNetPrice: number): number {
    return desiredNetPrice / (1 - COMMISSION_RATE);
  },
  getCommission(desiredNetPrice: number): number {
    return CommissionEngine.getPublicPrice(desiredNetPrice) - desiredNetPrice;
  },
  getHostNet(publicPrice: number): number {
    return publicPrice * (1 - COMMISSION_RATE);
  },
  getPlatformCut(publicPrice: number): number {
    return publicPrice * COMMISSION_RATE;
  },
};

export class PaymentService {
  static generateReference(reservationId: number): string {
    return `RL-${reservationId}-${Date.now()}`;
  }

  static async prepare(
    reservationId: number,
    amountCOP: number,
    customerEmail: string,
    customerName: string,
    customerPhone: string
  ): Promise<WompiPayload> {
    const reference = PaymentService.generateReference(reservationId);
    const amountInCents = Math.round(amountCOP * 100);
    const integrity_signature = await generateWompiSignature(
      reference,
      amountInCents,
      "COP",
      WOMPI_SANDBOX_INTEGRITY_KEY
    );

    return {
      amount_in_cents: amountInCents,
      currency: "COP",
      reference,
      integrity_signature,
      customer_data: {
        email: customerEmail,
        full_name: customerName,
        phone_number: customerPhone,
      },
    };
  }

  static async simulateSandboxPayment(
    payload: WompiPayload
  ): Promise<{ status: "APPROVED"; reference: string; message: string }> {
    await new Promise((r) => setTimeout(r, 1500));
    return {
      status: "APPROVED",
      reference: payload.reference,
      message: "Pago aprobado en modo sandbox. En producción se procesaría con Wompi.",
    };
  }
}
