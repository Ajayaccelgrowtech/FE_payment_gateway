import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PayGate — Secure Payment Gateway',
  description:
    'A fully-featured payment gateway simulation with real-time card validation, lifecycle management, and transaction history.',
  keywords: ['payment', 'gateway', 'secure', 'credit card', 'transaction'],
  openGraph: {
    title: 'PayGate — Secure Payment Gateway',
    description: 'Simulate and manage payment transactions with full lifecycle support.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
