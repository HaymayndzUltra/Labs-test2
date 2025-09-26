import { StringOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import { summariseIntake } from '@/lib/clients/openai';

const prompt = new PromptTemplate({
  inputVariables: ['context'],
  template: `You are an expert analytics consultant summarising client discovery sessions.
Return three bullet points focusing on:
1. Business objective
2. Success metrics
3. Immediate automation unlocks

Context:
{context}
`,
});

export const buildSummary = async (context: string) => {
  const formatted = await prompt.format({ context });
  const parser = new StringOutputParser();
  const output = await summariseIntake(formatted);
  return parser.parse(output);
};
