export type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed' | 'timeout';

export type CardType = 'visa' | 'mastercard' | 'amex' | 'unknown';

export type Currency = 'INR' | 'USD';

export interface PaymentPayload {
  transactionId: string;
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  amount: number;
  currency: Currency;
}

export interface PaymentApiResponse {
  success: boolean;
  transactionId: string;
  message: string;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  timestamp: string;
  cardholderName: string;
  cardLast4: string;
  attempts: number;
  failureReason?: string;
}

export interface PaymentFormValues {
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  amount: string;
  currency: Currency;
}

export interface PaymentFormErrors {
  cardholderName?: string;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
  amount?: string;
}
