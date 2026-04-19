export function platformFeePercent(): number {
  const raw = Number(process.env.PLATFORM_FEE_PERCENT ?? 15);
  return Number.isFinite(raw) ? Math.max(0, Math.min(50, raw)) : 15;
}

/**
 * Split a gross amount (minor units) into platform fee and tutor share.
 * Uses floor to ensure platform_fee + tutor_share === amount.
 */
export function computeCommission(amount: number): { platformFee: number; tutorShare: number } {
  const pct = platformFeePercent();
  const platformFee = Math.floor((amount * pct) / 100);
  const tutorShare = amount - platformFee;
  return { platformFee, tutorShare };
}
