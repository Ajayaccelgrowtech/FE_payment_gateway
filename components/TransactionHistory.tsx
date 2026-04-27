'use client';

import React from 'react';
import { Transaction } from '@/types';
import { formatAmount, formatTimestamp, shortId } from '@/utils/formatters';
import { usePaymentStore } from '@/store/paymentStore';

export default function TransactionHistory() {
  const { transactions, selectTransaction } = usePaymentStore();

  if (transactions.length === 0) {
    return (
      <div className="history-empty" aria-live="polite">
        <div style={{ fontSize: '2rem', marginBottom: 8 }}>🧾</div>
        No transactions yet. Complete a payment to see history.
      </div>
    );
  }

  return (
    <ul className="history-list" aria-label="Transaction history" role="list">
      {transactions.map((tx) => (
        <li key={tx.id} role="listitem">
          <button
            className="tx-item"
            onClick={() => selectTransaction(tx)}
            aria-label={`Transaction ${shortId(tx.id)}, ${tx.status}, ${formatAmount(tx.amount, tx.currency)}`}
          >
            <span className={`tx-item__dot tx-item__dot--${tx.status}`} aria-hidden="true" />
            <div className="tx-item__body">
              <div className="tx-item__id">#{shortId(tx.id)}</div>
              <div className="tx-item__meta">{formatTimestamp(tx.timestamp)}</div>
            </div>
            <span className="tx-item__amount">{formatAmount(tx.amount, tx.currency)}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export function TransactionDetail() {
  const { selectedTransaction, selectTransaction } = usePaymentStore();

  if (!selectedTransaction) return null;

  const tx = selectedTransaction;

  const statusLabels: Record<string, string> = {
    success: '✅ Success',
    failed: '❌ Failed',
    timeout: '⏱ Timeout',
    processing: '⏳ Processing',
    idle: '—',
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) selectTransaction(null);
      }}
    >
      <div className="modal">
        <div className="modal__header">
          <h2 className="modal__title" id="modal-title">
            Transaction Details
          </h2>
          <button
            className="modal__close"
            onClick={() => selectTransaction(null)}
            aria-label="Close transaction details"
          >
            ✕
          </button>
        </div>

        <div className="detail-grid">
          <div className="detail-item">
            <div className="detail-item__label">Transaction ID</div>
            <div className="detail-item__value" style={{ fontSize: '0.72rem', fontFamily: 'monospace' }}>
              {tx.id}
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-item__label">Status</div>
            <div className="detail-item__value">
              <span className={`status-pill status-pill--${tx.status}`}>
                {statusLabels[tx.status]}
              </span>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-item__label">Amount</div>
            <div className="detail-item__value">{formatAmount(tx.amount, tx.currency)}</div>
          </div>

          <div className="detail-item">
            <div className="detail-item__label">Attempts</div>
            <div className="detail-item__value">{tx.attempts}</div>
          </div>

          <div className="detail-item">
            <div className="detail-item__label">Card Holder</div>
            <div className="detail-item__value">{tx.cardholderName}</div>
          </div>

          <div className="detail-item">
            <div className="detail-item__label">Card</div>
            <div className="detail-item__value">•••• {tx.cardLast4}</div>
          </div>

          <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
            <div className="detail-item__label">Timestamp</div>
            <div className="detail-item__value">{formatTimestamp(tx.timestamp)}</div>
          </div>

          {tx.failureReason && (
            <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
              <div className="detail-item__label">Failure Reason</div>
              <div className="detail-item__value" style={{ color: 'var(--danger)' }}>
                {tx.failureReason}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
