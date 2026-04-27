'use client';

import React from 'react';
import { CardType, Currency, PaymentFormErrors, PaymentFormValues } from '@/types';

interface FieldProps {
  id: string;
  label: string;
  value: string;
  error?: string;
  placeholder?: string;
  maxLength?: number;
  inputMode?: React.InputHTMLAttributes<HTMLInputElement>['inputMode'];
  onChange: (val: string) => void;
  onBlur: () => void;
  children?: React.ReactNode;
  className?: string;
}

export function FormField({
  id,
  label,
  value,
  error,
  placeholder,
  maxLength,
  inputMode,
  onChange,
  onBlur,
  children,
  className = '',
}: FieldProps) {
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <div className="field__input-wrap">
        <input
          id={id}
          className={`field__input ${error ? 'field__input--error' : ''} ${className}`}
          value={value}
          placeholder={placeholder}
          maxLength={maxLength}
          inputMode={inputMode}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={!!error}
          autoComplete="off"
        />
        {children}
      </div>
      {error && (
        <span id={`${id}-error`} className="field__error" role="alert" aria-live="polite">
          ⚠ {error}
        </span>
      )}
    </div>
  );
}

interface CardBadgeProps {
  cardType: CardType;
}

const CARD_LABELS: Record<CardType, string> = {
  visa: '💳 Visa',
  mastercard: '🔴 MC',
  amex: '🔵 Amex',
  unknown: '',
};

export function CardTypeBadge({ cardType }: CardBadgeProps) {
  if (cardType === 'unknown') return null;
  return (
    <span
      className={`card-type-badge card-type-badge--${cardType}`}
      aria-label={`Detected card type: ${cardType}`}
    >
      {CARD_LABELS[cardType]}
    </span>
  );
}

interface AmountFieldProps {
  amount: string;
  currency: Currency;
  error?: string;
  onAmountChange: (val: string) => void;
  onCurrencyChange: (val: Currency) => void;
  onBlur: () => void;
}

export function AmountField({
  amount,
  currency,
  error,
  onAmountChange,
  onCurrencyChange,
  onBlur,
}: AmountFieldProps) {
  return (
    <div className="field">
      <label className="field__label" htmlFor="amount">
        Amount
      </label>
      <div className="amount-wrap">
        <select
          id="currency"
          className="currency-select"
          value={currency}
          onChange={(e) => onCurrencyChange(e.target.value as Currency)}
          aria-label="Currency"
        >
          <option value="INR">INR ₹</option>
          <option value="USD">USD $</option>
        </select>
        <input
          id="amount"
          className={`field__input amount-input ${error ? 'field__input--error' : ''}`}
          value={amount}
          placeholder="0.00"
          inputMode="decimal"
          onChange={(e) => onAmountChange(e.target.value)}
          onBlur={onBlur}
          aria-describedby={error ? 'amount-error' : undefined}
          aria-invalid={!!error}
          autoComplete="off"
        />
      </div>
      {error && (
        <span id="amount-error" className="field__error" role="alert" aria-live="polite">
          ⚠ {error}
        </span>
      )}
    </div>
  );
}

interface CardInputProps {
  values: PaymentFormValues;
  errors: PaymentFormErrors;
  cardType: CardType;
  onChange: (field: keyof PaymentFormValues, val: string) => void;
  onBlur: (field: keyof PaymentFormValues) => void;
}

export default function CardInput({
  values,
  errors,
  cardType,
  onChange,
  onBlur,
}: CardInputProps) {
  const cvvLen = cardType === 'amex' ? 4 : 3;

  return (
    <div className="form">
      <FormField
        id="cardholderName"
        label="Cardholder Name"
        value={values.cardholderName}
        error={errors.cardholderName}
        placeholder="Jane Smith"
        onChange={(v) => onChange('cardholderName', v)}
        onBlur={() => onBlur('cardholderName')}
      />

      <FormField
        id="cardNumber"
        label="Card Number"
        value={values.cardNumber}
        error={errors.cardNumber}
        placeholder="0000 0000 0000 0000"
        inputMode="numeric"
        className="field__input--with-icon"
        onChange={(v) => onChange('cardNumber', v)}
        onBlur={() => onBlur('cardNumber')}
      >
        <CardTypeBadge cardType={cardType} />
      </FormField>

      <div className="form-row form-row--2">
        <FormField
          id="expiry"
          label="Expiry Date"
          value={values.expiry}
          error={errors.expiry}
          placeholder="MM/YY"
          inputMode="numeric"
          maxLength={5}
          onChange={(v) => onChange('expiry', v)}
          onBlur={() => onBlur('expiry')}
        />
        <FormField
          id="cvv"
          label={`CVV${cardType === 'amex' ? ' (4 digits)' : ''}`}
          value={values.cvv}
          error={errors.cvv}
          placeholder={'•'.repeat(cvvLen)}
          inputMode="numeric"
          maxLength={cvvLen}
          onChange={(v) => onChange('cvv', v)}
          onBlur={() => onBlur('cvv')}
        />
      </div>

      <AmountField
        amount={values.amount}
        currency={values.currency}
        error={errors.amount}
        onAmountChange={(v) => onChange('amount', v)}
        onCurrencyChange={(v) => onChange('currency', v)}
        onBlur={() => onBlur('amount')}
      />
    </div>
  );
}
