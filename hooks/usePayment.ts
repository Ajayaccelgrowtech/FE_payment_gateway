'use client';

import { useCallback, useRef } from 'react';
import { usePaymentStore } from '@/store/paymentStore';
import { PaymentPayload, Transaction } from '@/types';

const TIMEOUT_MS = 6000;
const MAX_RETRIES = 3;

export function usePayment() {
  const {
    status,
    currentTransactionId,
    attemptCount,
    failureReason,
    initPayment,
    setProcessing,
    setSuccess,
    setFailed,
    setTimeout: setTimeoutStatus,
    resetPayment,
    retryPayment,
  } = usePaymentStore();

  const abortControllerRef = useRef<AbortController | null>(null);

  const submitPayment = useCallback(
    async (payload: Omit<PaymentPayload, 'transactionId'> & { transactionId?: string }) => {
      if (status === 'processing') return;

      const txId =
        payload.transactionId ?? currentTransactionId ?? crypto.randomUUID();

      if (!currentTransactionId) {
        initPayment(txId);
      }

      setProcessing();

      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

      const fullPayload: PaymentPayload = { ...payload, transactionId: txId };

      try {
        const response = await fetch('/api/pay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fullPayload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const data = await response.json() as { success: boolean; message: string };

        const tx: Transaction = {
          id: txId,
          amount: fullPayload.amount,
          currency: fullPayload.currency,
          cardholderName: fullPayload.cardholderName,
          cardLast4: fullPayload.cardNumber.slice(-4),
          timestamp: new Date().toISOString(),
          attempts: attemptCount + 1,
          status: data.success ? 'success' : 'failed',
          failureReason: data.success ? undefined : data.message,
        };

        if (data.success) {
          setSuccess(tx);
        } else {
          setFailed(tx, data.message);
        }
      } catch (err: unknown) {
        clearTimeout(timeoutId);

        const isAbort =
          err instanceof DOMException && err.name === 'AbortError';

        const tx: Transaction = {
          id: txId,
          amount: fullPayload.amount,
          currency: fullPayload.currency,
          cardholderName: fullPayload.cardholderName,
          cardLast4: fullPayload.cardNumber.slice(-4),
          timestamp: new Date().toISOString(),
          attempts: attemptCount + 1,
          status: isAbort ? 'timeout' : 'failed',
          failureReason: isAbort
            ? 'Request timed out. Please try again.'
            : 'A network error occurred. Please check your connection.',
        };

        if (isAbort) {
          setTimeoutStatus(tx);
        } else {
          setFailed(
            tx,
            'A network error occurred. Please check your connection.'
          );
        }
      }
    },
    [
      status,
      currentTransactionId,
      attemptCount,
      initPayment,
      setProcessing,
      setSuccess,
      setFailed,
      setTimeoutStatus,
    ]
  );

  const canRetry = attemptCount < MAX_RETRIES;
  const isExhausted = attemptCount >= MAX_RETRIES;

  return {
    status,
    currentTransactionId,
    attemptCount,
    failureReason,
    canRetry,
    isExhausted,
    maxRetries: MAX_RETRIES,
    submitPayment,
    resetPayment,
    retryPayment,
  };
}
