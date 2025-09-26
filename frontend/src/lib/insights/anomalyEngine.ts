export const detectAnomalies = (values: number[]) => {
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const std = Math.sqrt(values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length);
  return values
    .map((value, index) => ({ index, value, score: Math.abs(value - mean) / (std || 1) }))
    .filter((entry) => entry.score > 2.1);
};
