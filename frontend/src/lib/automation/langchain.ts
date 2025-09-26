export const summarizeIntake = async (inputs: string[]): Promise<string> => {
  return inputs.map((input, index) => `Insight ${index + 1}: ${input}`).join('\n');
};
