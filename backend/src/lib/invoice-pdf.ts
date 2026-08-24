import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export type InvoiceLineItem = {
  description: string;
  quantity?: number;
  unitPrice?: number;
  amount: number;
};

export type InvoicePdfData = {
  invoiceNumber: string;
  title: string;
  amount: number;
  currency: string;
  status: string;
  dueDate?: Date | null;
  createdAt: Date;
  items: InvoiceLineItem[];
  customer: {
    name: string;
    email: string;
    phone?: string | null;
  };
};

const BRAND = {
  name: 'Green Rock General Supply Ltd',
  phone: '+250 785 652 011',
  email: 'ishimwehervin10@gmail.com',
  address: 'Kigali, Rwanda',
  primary: rgb(0.04, 0.43, 0.32),
};

function formatMoney(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

function formatDate(d: Date) {
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export async function buildInvoicePdf(data: InvoicePdfData): Promise<Buffer> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let y = height - 48;

  page.drawText(BRAND.name, { x: 48, y, size: 16, font: bold, color: BRAND.primary });
  y -= 18;
  page.drawText(`${BRAND.address} · ${BRAND.phone}`, { x: 48, y, size: 9, font: regular, color: rgb(0.35, 0.35, 0.35) });
  y -= 14;
  page.drawText(BRAND.email, { x: 48, y, size: 9, font: regular, color: rgb(0.35, 0.35, 0.35) });

  page.drawText('INVOICE', { x: width - 140, y: height - 52, size: 22, font: bold, color: BRAND.primary });
  page.drawText(data.invoiceNumber, { x: width - 140, y: height - 72, size: 10, font: regular });

  y -= 36;
  page.drawLine({ start: { x: 48, y }, end: { x: width - 48, y }, thickness: 1, color: rgb(0.88, 0.88, 0.88) });
  y -= 28;

  page.drawText('Bill To', { x: 48, y, size: 10, font: bold });
  y -= 16;
  page.drawText(data.customer.name, { x: 48, y, size: 11, font: bold });
  y -= 14;
  page.drawText(data.customer.email, { x: 48, y, size: 10, font: regular, color: rgb(0.3, 0.3, 0.3) });
  if (data.customer.phone) {
    y -= 14;
    page.drawText(data.customer.phone, { x: 48, y, size: 10, font: regular, color: rgb(0.3, 0.3, 0.3) });
  }

  const metaX = width - 220;
  let metaY = height - 136;
  const metaRows: [string, string][] = [
    ['Invoice Date', formatDate(data.createdAt)],
    ['Due Date', data.dueDate ? formatDate(data.dueDate) : 'On receipt'],
    ['Status', data.status],
    ['Reference', data.title],
  ];
  for (const [label, value] of metaRows) {
    page.drawText(label, { x: metaX, y: metaY, size: 9, font: bold, color: rgb(0.4, 0.4, 0.4) });
    page.drawText(value, { x: metaX + 90, y: metaY, size: 9, font: regular });
    metaY -= 16;
  }

  y = Math.min(y, metaY) - 24;
  page.drawRectangle({ x: 48, y: y - 4, width: width - 96, height: 22, color: rgb(0.95, 0.97, 0.96) });
  page.drawText('Description', { x: 56, y: y + 2, size: 9, font: bold });
  page.drawText('Qty', { x: width - 200, y: y + 2, size: 9, font: bold });
  page.drawText('Amount', { x: width - 120, y: y + 2, size: 9, font: bold });
  y -= 22;

  const items = data.items.length > 0 ? data.items : [{ description: data.title, quantity: 1, amount: data.amount }];
  for (const item of items) {
    if (y < 120) break;
    const qty = item.quantity ?? 1;
    page.drawText(item.description.slice(0, 70), { x: 56, y, size: 10, font: regular });
    page.drawText(String(qty), { x: width - 200, y, size: 10, font: regular });
    page.drawText(formatMoney(item.amount, data.currency), { x: width - 120, y, size: 10, font: regular });
    y -= 18;
  }

  y -= 12;
  page.drawLine({ start: { x: width - 220, y }, end: { x: width - 48, y }, thickness: 1, color: rgb(0.85, 0.85, 0.85) });
  y -= 20;
  page.drawText('Total Due', { x: width - 200, y, size: 11, font: bold });
  page.drawText(formatMoney(data.amount, data.currency), { x: width - 120, y, size: 12, font: bold, color: BRAND.primary });

  page.drawText('Thank you for your business with Green Rock.', {
    x: 48,
    y: 72,
    size: 9,
    font: regular,
    color: rgb(0.45, 0.45, 0.45),
  });
  page.drawText('Payment inquiries: ishimwehervin10@gmail.com · +250 785 652 011', {
    x: 48,
    y: 56,
    size: 8,
    font: regular,
    color: rgb(0.55, 0.55, 0.55),
  });

  const bytes = await pdf.save();
  return Buffer.from(bytes);
}

export function parseInvoiceItems(raw: unknown): InvoiceLineItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const row = item as Record<string, unknown>;
      const description = String(row.description ?? '').trim();
      const quantity = Number(row.quantity ?? 1) || 1;
      const unitPrice = Number(row.unitPrice ?? row.amount ?? 0);
      const amount = Number(row.amount ?? unitPrice * quantity);
      if (!description) return null;
      return { description, quantity, unitPrice, amount };
    })
    .filter(Boolean) as InvoiceLineItem[];
}
