import { Transaction } from '@/types';

const STORAGE_KEY = 'pg_transactions';

export function loadTransactions(): Transaction[] {
  try {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Transaction[];
  } catch {
    return [];
  }
}

export function saveTransactions(transactions: Transaction[]): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch {
  }
}

export function upsertTransaction(
  list: Transaction[],
  tx: Transaction
): Transaction[] {
  const idx = list.findIndex((t) => t.id === tx.id);
  if (idx !== -1) {
    const updated = [...list];
    updated[idx] = tx;
    return updated;
  }
  return [tx, ...list];
}
