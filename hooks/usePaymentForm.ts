'use client';

import { useState, useCallback } from 'react';
import { PaymentFormValues, PaymentFormErrors } from '@/types';
import { validateField, isFormValid } from '@/utils/validation';
import { detectCardType, formatCardNumber, maxCardLength, cvvLength } from '@/utils/cardUtils';

const INITIAL_VALUES: PaymentFormValues = {
  cardholderName: '',
  cardNumber: '',
  expiry: '',
  cvv: '',
  amount: '',
  currency: 'INR',
};

export function usePaymentForm() {
  const [values, setValues] = useState<PaymentFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<PaymentFormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof PaymentFormValues, boolean>>>({});

  const cardType = detectCardType(values.cardNumber);

  const handleChange = useCallback(
    (field: keyof PaymentFormValues, rawValue: string) => {
      let value = rawValue;

      if (field === 'cardNumber') {
        const digits = rawValue.replace(/\D/g, '').slice(0, maxCardLength(detectCardType(rawValue)));
        const ct = detectCardType(digits);
        value = formatCardNumber(digits, ct);
      }

      if (field === 'expiry') {
        let cleaned = rawValue.replace(/\D/g, '').slice(0, 4);
        if (cleaned.length > 2) cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
        value = cleaned;
      }

      if (field === 'cvv') {
        const ct = detectCardType(values.cardNumber);
        value = rawValue.replace(/\D/g, '').slice(0, cvvLength(ct));
      }

      if (field === 'amount') {
        value = rawValue.replace(/[^0-9.]/g, '');
        const parts = value.split('.');
        if (parts.length > 2) value = parts[0] + '.' + parts.slice(1).join('');
      }

      setValues((prev) => {
        const next = { ...prev, [field]: value };
        if (touched[field]) {
          setErrors((prevErr) => {
            const err = validateField(field, next);
            const updated = { ...prevErr };
            if (err) updated[field as keyof PaymentFormErrors] = err;
            else delete updated[field as keyof PaymentFormErrors];
            return updated;
          });
        }
        return next;
      });
    },
    [touched, values.cardNumber]
  );

  const handleBlur = useCallback(
    (field: keyof PaymentFormValues) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const err = validateField(field, values);
      setErrors((prev) => {
        const updated = { ...prev };
        if (err) updated[field as keyof PaymentFormErrors] = err;
        else delete updated[field as keyof PaymentFormErrors];
        return updated;
      });
    },
    [values]
  );

  const resetForm = useCallback(() => {
    setValues(INITIAL_VALUES);
    setErrors({});
    setTouched({});
  }, []);

  return {
    values,
    errors,
    touched,
    cardType,
    handleChange,
    handleBlur,
    resetForm,
    isValid: isFormValid(values),
  };
}
