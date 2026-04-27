# Premium Payment Gateway UI

A high-fidelity, production-ready Payment Gateway interface built with **Next.js 15**, **TypeScript**, and **Zustand**. This project simulates a real-world payment lifecycle including processing, success, failure, and timeout states.

## 🚀 Key Features
- **Real-time Validation:** Field-level validation on blur/input.
- **Card Detection:** Auto-detection for Visa, Mastercard, and Amex with dynamic UI updates.
- **State Management:** Robust payment lifecycle (Idle -> Processing -> Success/Failed/Timeout) managed via Zustand.
- **Resilience:** Built-in retry mechanism (3 attempts) and frontend timeouts (AbortController).
- **History & Persistence:** LocalStorage-based transaction history with detailed modal views.
- **Accessibility:** Semantic HTML, ARIA labels, and focus management for screen readers.

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18.x or later
- npm or yarn

### Installation
1. Clone the repository
2. Navigate to the project folder:
   ```bash
   cd payment-gateway
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧠 Assumptions Made
1. **API Simulation:** The `/api/pay` route uses a 2-second delay for success/failure and an 8.5-second delay to trigger the frontend timeout.
2. **Outcome Distribution:** 60% Success, 25% Failure (insufficient funds, etc.), 15% Gateway Timeout.
3. **Timeout Limit:** The frontend is configured to abort requests after 6 seconds to ensure a good user experience.
4. **Idempotency:** A unique `transactionId` is generated at the start of a payment attempt and persists through retries to prevent duplicate charges.

## 📈 Future Improvements (Given More Time)
1. **Server-side Validation:** Move all validation logic to the API layer for increased security.
2. **Unit Testing:** Implement Jest/Vitest for utility functions and Playwright for E2E payment flows.
3. **Real Backend Integration:** Replace the mock API with a real payment provider (Stripe/Razorpay) using webhooks.
4. **Advanced Animations:** Add Framer Motion for smoother transitions between card states and status screens.
5. **Localization:** Add multi-language support (i18n) for global payment forms.
