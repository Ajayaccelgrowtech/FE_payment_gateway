'use client';

import React, { useEffect, useRef } from 'react';
import { PaymentStatus } from '@/types';

interface StatusScreenProps {
  status: PaymentStatus;
  failureReason: string | null;
  attemptCount: number;
  maxRetries: number;
  canRetry: boolean;
  isExhausted: boolean;
  onRetry: () => void;
  onReset: () => void;
}

const STATUS_CONFIG = {
  processing: {
    icon: <div className="spinner" aria-hidden="true" />,
    iconClass: 'status-screen__icon--processing',
    title: 'Processing Payment…',
    titleClass: 'status-screen__title--processing',
    message: 'Please wait. Do not close this window.',
  },
  success: {
    icon: '✅',
    iconClass: 'status-screen__icon--success',
    title: 'Payment Successful!',
    titleClass: 'status-screen__title--success',
    message: 'Your transaction has been processed.',
  },
  failed: {
    icon: '❌',
    iconClass: 'status-screen__icon--failed',
    title: 'Payment Failed',
    titleClass: 'status-screen__title--failed',
    message: null,
  },
  timeout: {
    icon: '⏱️',
    iconClass: 'status-screen__icon--timeout',
    title: 'Request Timed Out',
    titleClass: 'status-screen__title--timeout',
    message: 'The gateway did not respond in time.',
  },
  idle: null,
};

export default function StatusScreen({
  status,
  failureReason,
  attemptCount,
  maxRetries,
  canRetry,
  isExhausted,
  onRetry,
  onReset,
}: StatusScreenProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (status !== 'idle' && status !== 'processing') {
      titleRef.current?.focus();
    }
  }, [status]);

  if (status === 'idle') return null;

  const config = STATUS_CONFIG[status];
  if (!config) return null;

  const isTerminal = status === 'success';
  const isRetryable = (status === 'failed' || status === 'timeout') && canRetry;
  const showExhausted = (status === 'failed' || status === 'timeout') && isExhausted;

  return (
    <div className="status-screen" role="region" aria-label={`Payment status: ${status}`}>
      <div className={`status-screen__icon ${config.iconClass}`} aria-hidden="true">
        {config.icon}
      </div>

      <h2
        ref={titleRef}
        className={`status-screen__title ${config.titleClass}`}
        tabIndex={-1}
      >
        {config.title}
      </h2>

      <p className="status-screen__message">
        {status === 'failed' ? (failureReason ?? 'Payment could not be completed.') : config.message}
      </p>

      {(status === 'failed' || status === 'timeout') && (
        <div className="attempt-indicator" aria-live="polite">
          Attempt {attemptCount} of {maxRetries}
        </div>
      )}

      {status !== 'processing' && (
        <div className="status-screen__actions">
          {isRetryable && (
            <button className="btn-primary" onClick={onRetry} id="retry-btn">
              🔄 Retry Payment
            </button>
          )}
          {showExhausted && (
            <p className="field__error" style={{ justifyContent: 'center' }}>
              Maximum retry attempts reached. Please start a new transaction.
            </p>
          )}
          {(isTerminal || showExhausted) && (
            <button className="btn-primary" onClick={onReset} id="new-payment-btn">
              + New Payment
            </button>
          )}
          {!isTerminal && (
            <button className="btn-secondary" onClick={onReset} id="cancel-btn">
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  );
}
