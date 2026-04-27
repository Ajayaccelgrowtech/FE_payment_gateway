import { PaymentFormValues, PaymentFormErrors } from '@/types';
import { detectCardType, maxCardLength, cvvLength } from './cardUtils';

export function validateField(
  field: keyof PaymentFormValues,
  values: PaymentFormValues
): string | undefined {
  const { cardholderName, cardNumber, expiry, cvv, amount } = values;
  const cardType = detectCardType(cardNumber);

  switch (field) {
    case 'cardholderName': {
      if (!cardholderName.trim()) return 'Cardholder name is required.';
      if (cardholderName.trim().length < 2) return 'Name must be at least 2 characters.';
      if (!/^[a-zA-Z\s'-]+$/.test(cardholderName)) return 'Name can only contain letters.';
      return undefined;
    }

    case 'cardNumber': {
      const digits = cardNumber.replace(/\s/g, '');
      if (!digits) return 'Card number is required.';
      if (digits.length !== maxCardLength(cardType)) {
        return `Card number must be ${maxCardLength(cardType)} digits.`;
      }
      if (!/^\d+$/.test(digits)) return 'Card number must contain only digits.';
      return undefined;
    }

    case 'expiry': {
      if (!expiry) return 'Expiry date is required.';
      if (!/^\d{2}\/\d{2}$/.test(expiry)) return 'Use MM/YY format.';
      const [mm, yy] = expiry.split('/').map(Number);
      if (mm < 1 || mm > 12) return 'Month must be between 01 and 12.';
      const now = new Date();
      const currentYear = now.getFullYear() % 100;
      const currentMonth = now.getMonth() + 1;
      if (yy < currentYear || (yy === currentYear && mm < currentMonth)) {
        return 'Card has expired.';
      }
      return undefined;
    }

    case 'cvv': {
      const len = cvvLength(cardType);
      if (!cvv) return 'CVV is required.';
      if (!/^\d+$/.test(cvv)) return 'CVV must be numeric.';
      if (cvv.length !== len) return `CVV must be ${len} digits.`;
      return undefined;
    }

    case 'amount': {
      if (!amount) return 'Amount is required.';
      const num = parseFloat(amount);
      if (isNaN(num) || num <= 0) return 'Amount must be greater than 0.';
      if (num > 1_000_000) return 'Amount exceeds the maximum limit.';
      return undefined;
    }

    default:
      return undefined;
  }
}

export function validateAll(values: PaymentFormValues): PaymentFormErrors {
  const fields: (keyof PaymentFormValues)[] = [
    'cardholderName',
    'cardNumber',
    'expiry',
    'cvv',
    'amount',
  ];
  const errors: PaymentFormErrors = {};
  for (const field of fields) {
    const err = validateField(field, values);
    if (err) errors[field as keyof PaymentFormErrors] = err;
  }
  return errors;
}

export function isFormValid(values: PaymentFormValues): boolean {
  return Object.keys(validateAll(values)).length === 0;
}
