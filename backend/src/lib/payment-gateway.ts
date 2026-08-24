import { generateNumber } from './roles';

export type PaymentMethod = 'MOMO' | 'CARD' | 'BANK';

export interface PaymentInitResult {
  mode: 'flutterwave' | 'manual';
  reference: string;
  amount: number;
  currency: string;
  paymentLink?: string;
  instructions?: string;
}

export async function initiateOnlinePayment(data: {
  invoiceNumber: string;
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string | null;
  method: PaymentMethod;
}): Promise<PaymentInitResult> {
  const reference = generateNumber('PAY');
  const secret = process.env.FLUTTERWAVE_SECRET_KEY;
  const publicKey = process.env.FLUTTERWAVE_PUBLIC_KEY;

  if (secret && publicKey && data.method === 'CARD') {
    try {
      const res = await fetch('https://api.flutterwave.com/v3/payments', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${secret}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tx_ref: reference,
          amount: data.amount,
          currency: data.currency,
          redirect_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/portal/payments?status=complete&ref=${reference}`,
          customer: {
            email: data.customerEmail,
            name: data.customerName,
            phonenumber: data.customerPhone ?? undefined,
          },
          customizations: {
            title: 'Green Rock',
            description: `Invoice ${data.invoiceNumber}`,
            logo: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/logo.png`,
          },
        }),
      });

      const json = (await res.json()) as { status?: string; data?: { link?: string } };
      if (json.status === 'success' && json.data?.link) {
        return {
          mode: 'flutterwave',
          reference,
          amount: data.amount,
          currency: data.currency,
          paymentLink: json.data.link,
        };
      }
    } catch (err) {
      console.error('[Payment] Flutterwave init failed, falling back to manual:', err);
    }
  }

  const momoCode = process.env.MOMO_MERCHANT_CODE || '785652011';
  const instructions =
    data.method === 'MOMO'
      ? `Dial *182*8*1*${momoCode}# and pay ${data.amount.toLocaleString()} ${data.currency}. Use reference: ${reference}`
      : data.method === 'BANK'
        ? `Transfer ${data.amount.toLocaleString()} ${data.currency} to Green Rock General Supply Ltd. Reference: ${reference}. Email proof to ishimwehervin10@gmail.com`
        : `Contact Green Rock to complete card payment. Reference: ${reference}`;

  return {
    mode: 'manual',
    reference,
    amount: data.amount,
    currency: data.currency,
    instructions,
  };
}
