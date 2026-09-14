/**
 * Utility functions for Airport Telephone CDR Billing calculations
 * Prepared for Node.js backend integration and client-side reactive recalculation.
 */

export interface CallCostResult {
  billableMinutes: number;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
}

/**
 * Calculates call cost based on duration, rate per minute, and pulse.
 * @param durationSeconds Call duration in seconds
 * @param ratePerMinute Rate per minute in INR
 * @param pulseSeconds Billing pulse (default 60 seconds)
 * @param taxPercent GST percentage (default 18%)
 */
export function calculateCallCost(
  durationSeconds: number,
  ratePerMinute: number,
  pulseSeconds: number = 60,
  taxPercent: number = 18
): CallCostResult {
  if (durationSeconds <= 0 || ratePerMinute <= 0) {
    return { billableMinutes: 0, subtotal: 0, taxAmount: 0, totalAmount: 0 };
  }

  // Calculate pulses
  const pulses = Math.ceil(durationSeconds / pulseSeconds);
  const billableMinutes = (pulses * pulseSeconds) / 60;
  
  const subtotal = Number((billableMinutes * ratePerMinute).toFixed(2));
  const taxAmount = Number(((subtotal * taxPercent) / 100).toFixed(2));
  const totalAmount = Number((subtotal + taxAmount).toFixed(2));

  return {
    billableMinutes,
    subtotal,
    taxAmount,
    totalAmount,
  };
}

/**
 * Formats seconds into HH:MM:SS or MM:SS
 */
export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '00:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Formats number to Indian Rupee currency format (₹ xx,xxx.xx)
 */
export function formatCurrency(amount: number, includeDecimals = true): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  }).format(amount);
}
