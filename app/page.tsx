'use client';

import React, { useEffect } from 'react';
import PaymentForm from '@/components/PaymentForm';
import TransactionHistory, { TransactionDetail } from '@/components/TransactionHistory';
import { usePaymentStore } from '@/store/paymentStore';

export default function HomePage() {
  const { loadHistory } = usePaymentStore();

  // Hydrate transaction history from localStorage on mount
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return (
    <>
      <div className="app-shell">
        {/* Header */}
        <header className="app-header">
          <a className="app-header__logo" href="/" aria-label="PayGate home">
            <div className="app-header__logo-icon" aria-hidden="true">💳</div>
            PayGate
          </a>
          <span className="app-header__badge">Secure Sandbox</span>
        </header>

        {/* Main — Payment Form */}
        <main className="main-panel" id="main-content">
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>
            Make a Payment
          </h1>
          <PaymentForm />
        </main>

        {/* Sidebar — Transaction History */}
        <aside className="sidebar-panel" aria-label="Transaction history">
          <div className="card">
            <h2 className="card__title">
              <span className="card__title-icon">🧾</span>
              Transaction History
            </h2>
            <TransactionHistory />
          </div>
        </aside>
      </div>

      {/* Modal — rendered outside shell for z-index */}
      <TransactionDetail />
    </>
  );
}
