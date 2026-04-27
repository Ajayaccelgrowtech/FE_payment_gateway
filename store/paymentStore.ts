import { create } from 'zustand';
import { PaymentStatus, Transaction, Currency } from '@/types';
import { loadTransactions, saveTransactions, upsertTransaction } from '@/utils/storage';

interface PaymentState {
  status: PaymentStatus;
  currentTransactionId: string | null;
  attemptCount: number;
  failureReason: string | null;
  selectedTransaction: Transaction | null;
  transactions: Transaction[];
  initPayment: (transactionId: string) => void;
  setProcessing: () => void;
  setSuccess: (tx: Transaction) => void;
  setFailed: (tx: Transaction, reason: string) => void;
  setTimeout: (tx: Transaction) => void;
  resetPayment: () => void;
  retryPayment: () => void;
  selectTransaction: (tx: Transaction | null) => void;
  loadHistory: () => void;
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
  status: 'idle',
  currentTransactionId: null,
  attemptCount: 0,
  failureReason: null,
  selectedTransaction: null,
  transactions: [],

  initPayment: (transactionId) =>
    set({
      status: 'idle',
      currentTransactionId: transactionId,
      attemptCount: 0,
      failureReason: null,
    }),

  setProcessing: () => set({ status: 'processing' }),

  setSuccess: (tx) => {
    const updated = upsertTransaction(get().transactions, tx);
    saveTransactions(updated);
    set({ status: 'success', transactions: updated, failureReason: null });
  },

  setFailed: (tx, reason) => {
    const updated = upsertTransaction(get().transactions, tx);
    saveTransactions(updated);
    set({
      status: 'failed',
      transactions: updated,
      failureReason: reason,
      attemptCount: get().attemptCount + 1,
    });
  },

  setTimeout: (tx) => {
    const updated = upsertTransaction(get().transactions, tx);
    saveTransactions(updated);
    set({
      status: 'timeout',
      transactions: updated,
      failureReason: 'Request timed out. Please try again.',
      attemptCount: get().attemptCount + 1,
    });
  },

  resetPayment: () =>
    set({
      status: 'idle',
      currentTransactionId: null,
      attemptCount: 0,
      failureReason: null,
    }),

  retryPayment: () => set({ status: 'idle' }),

  selectTransaction: (tx) => set({ selectedTransaction: tx }),

  loadHistory: () => {
    const txs = loadTransactions();
    set({ transactions: txs });
  },
}));
