import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

export const openaiClient = apiKey
  ? new OpenAI({ apiKey, dangerouslyAllowBrowser: false })
  : undefined;

export const summariseIntake = async (prompt: string) => {
  if (!openaiClient) {
    return 'TODO: Connect OpenAI API key to enable live synthesis.';
  }

  const response = await openaiClient.responses.create({
    model: 'gpt-4.1-mini',
    input: prompt,
  });

  return response.output_text;
};
