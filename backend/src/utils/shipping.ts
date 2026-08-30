export type ShippingMethod = 'standard' | 'express' | 'pickup';

export const calculateShippingCost = (totalWeightKg: number, shippingMethod: ShippingMethod = 'standard'): number => {
  const baseCost = totalWeightKg <= 1 ? 15.0 : totalWeightKg <= 3 ? 25.0 : 35.0;

  if (shippingMethod === 'express') return Number((baseCost + 18).toFixed(2));
  if (shippingMethod === 'pickup') return 0;

  return Number(baseCost.toFixed(2));
};