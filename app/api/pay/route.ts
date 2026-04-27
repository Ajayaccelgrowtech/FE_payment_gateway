import { NextRequest, NextResponse } from 'next/server';
import { PaymentPayload } from '@/types';

const PROCESSING_DELAY = 2000;
const TIMEOUT_DELAY = 8500;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as PaymentPayload;

  if (!body.transactionId || !body.cardholderName || !body.amount) {
    return NextResponse.json(
      { success: false, message: 'Invalid payload.' },
      { status: 400 }
    );
  }

  const roll = Math.random();

  if (roll < 0.60) {
    await sleep(PROCESSING_DELAY);
    return NextResponse.json({
      success: true,
      transactionId: body.transactionId,
      message: 'Payment processed successfully.',
    });
  }

  if (roll < 0.85) {
    await sleep(PROCESSING_DELAY);
    const reasons = [
      'Insufficient funds',
      'Card declined by issuer',
      'Transaction limit exceeded',
      'Invalid card details',
    ];
    const reason = reasons[Math.floor(Math.random() * reasons.length)];
    return NextResponse.json({
      success: false,
      transactionId: body.transactionId,
      message: reason,
    });
  }

  await sleep(TIMEOUT_DELAY);
  return NextResponse.json({
    success: false,
    transactionId: body.transactionId,
    message: 'Gateway timeout.',
  });
}
