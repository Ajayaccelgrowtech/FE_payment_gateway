import { CardType } from '@/types';

export function detectCardType(raw: string): CardType {
  const digits = raw.replace(/\s/g, '');
  if (/^4/.test(digits)) return 'visa';
  if (/^5[1-5]/.test(digits) || /^2(2[2-9][1-9]|[3-6]\d{2}|7[01]\d|720)/.test(digits)) return 'mastercard';
  if (/^3[47]/.test(digits)) return 'amex';
  return 'unknown';
}

export function formatCardNumber(raw: string, cardType: CardType): string {
  const digits = raw.replace(/\D/g, '');
  if (cardType === 'amex') {
    const p1 = digits.slice(0, 4);
    const p2 = digits.slice(4, 10);
    const p3 = digits.slice(10, 15);
    return [p1, p2, p3].filter(Boolean).join(' ');
  }
  const chunks = digits.match(/.{1,4}/g) ?? [];
  return chunks.join(' ');
}

export function maxCardLength(cardType: CardType): number {
  return cardType === 'amex' ? 15 : 16;
}

export function cvvLength(cardType: CardType): number {
  return cardType === 'amex' ? 4 : 3;
}

export function maskCardNumber(formatted: string): string {
  const digits = formatted.replace(/\s/g, '');
  const last4 = digits.slice(-4);
  const masked = '•'.repeat(digits.length - 4) + last4;
  return masked.match(/.{1,4}/g)?.join(' ') ?? masked;
}

export function previewCardNumber(formatted: string, cardType: CardType): string {
  const digits = formatted.replace(/\s/g, '');
  const totalLen = maxCardLength(cardType);
  const padded = digits.padEnd(totalLen, '•');

  if (cardType === 'amex') {
    return `${padded.slice(0, 4)} ${padded.slice(4, 10)} ${padded.slice(10, 15)}`;
  }
  return padded.match(/.{1,4}/g)?.join(' ') ?? padded;
}
