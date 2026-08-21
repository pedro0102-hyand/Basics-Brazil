export const calculateShippingCost = (totalWeightKg: number): number => {
  if (totalWeightKg <= 1) return 15.0;
  if (totalWeightKg <= 3) return 25.0;
  return 35.0;
};