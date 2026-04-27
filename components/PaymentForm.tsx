'use client';

import React, { useCallback } from 'react';
import { usePaymentForm } from '@/hooks/usePaymentForm';
import { usePayment } from '@/hooks/usePayment';
import { usePaymentStore } from '@/store/paymentStore';
import CardInput from './CardInput';
import CardPreview from './CardPreview';
import StatusScreen from './StatusScreen';

export default function PaymentForm() {
  const { values, errors, cardType, handleChange, handleBlur, isValid, resetForm } =
    usePaymentForm();

  const {
    status,
    currentTransactionId,
    attemptCount,
    failureReason,
    canRetry,
    isExhausted,
    maxRetries,
    submitPayment,
    resetPayment,
    retryPayment,
  } = usePayment();

  const { initPayment } = usePaymentStore();

  const isProcessing = status === 'processing';
  const showForm = status === 'idle';
  const showStatus = status !== 'idle';

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isValid || isProcessing) return;

      const txId = currentTransactionId ?? crypto.randomUUID();
      if (!currentTransactionId) initPayment(txId);

      await submitPayment({
        transactionId: txId,
        cardholderName: values.cardholderName,
        cardNumber: values.cardNumber.replace(/\s/g, '').slice(-4),
        expiry: values.expiry,
        amount: parseFloat(values.amount),
        currency: values.currency,
      });
    },
    [isValid, isProcessing, currentTransactionId, values, submitPayment, initPayment]
  );

  const handleReset = useCallback(() => {
    resetForm();
    resetPayment();
  }, [resetForm, resetPayment]);

  const handleRetry = useCallback(() => {
    retryPayment();
  }, [retryPayment]);

  return (
    <div className="card">
      <div style={{ marginBottom: 28 }}>
        <CardPreview
          cardholderName={values.cardholderName}
          cardNumber={values.cardNumber}
          expiry={values.expiry}
          cardType={cardType}
        />
      </div>

      {showStatus && (
        <StatusScreen
          status={status}
          failureReason={failureReason}
          attemptCount={attemptCount}
          maxRetries={maxRetries}
          canRetry={canRetry}
          isExhausted={isExhausted}
          onRetry={handleRetry}
          onReset={handleReset}
        />
      )}

      {showForm && (
        <form onSubmit={handleSubmit} noValidate aria-label="Payment form">
          <CardInput
            values={values}
            errors={errors}
            cardType={cardType}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <div style={{ marginTop: 24 }}>
            <button
              type="submit"
              id="pay-now-btn"
              className="btn-primary"
              disabled={!isValid || isProcessing}
              aria-label="Submit payment"
            >
              🔒 Pay Now
            </button>
          </div>

          {currentTransactionId && (
            <p
              style={{
                marginTop: 10,
                textAlign: 'center',
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                fontFamily: 'monospace',
              }}
            >
              TXN: {currentTransactionId.slice(0, 8).toUpperCase()}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
