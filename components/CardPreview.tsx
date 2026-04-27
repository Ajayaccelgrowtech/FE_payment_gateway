'use client';

import React from 'react';
import { CardType } from '@/types';
import { previewCardNumber } from '@/utils/cardUtils';

interface CardPreviewProps {
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cardType: CardType;
}

const NETWORK_LABELS: Record<CardType, string> = {
  visa: '💳 VISA',
  mastercard: '🔴 MC',
  amex: '🔵 AMEX',
  unknown: '',
};

export default function CardPreview({
  cardholderName,
  cardNumber,
  expiry,
  cardType,
}: CardPreviewProps) {
  const displayNumber = previewCardNumber(cardNumber, cardType);
  const displayName = cardholderName.trim() || 'FULL NAME';
  const displayExpiry = expiry || 'MM/YY';

  return (
    <div
      className={`credit-card credit-card--${cardType}`}
      role="img"
      aria-label={`Card preview for ${displayName}`}
    >
      <div className="credit-card__shine" />
      <div className="credit-card__circles" />

      <div className="credit-card__top">
        <div className="credit-card__chip" aria-hidden="true" />
        <span className="credit-card__network" aria-label={cardType}>
          {NETWORK_LABELS[cardType]}
        </span>
      </div>

      <div className="credit-card__number" aria-label="Card number">
        {displayNumber}
      </div>

      <div className="credit-card__bottom">
        <div>
          <div className="credit-card__label">Card Holder</div>
          <div className="credit-card__value">{displayName.toUpperCase()}</div>
        </div>
        <div>
          <div className="credit-card__label">Expires</div>
          <div className="credit-card__value">{displayExpiry}</div>
        </div>
      </div>
    </div>
  );
}
