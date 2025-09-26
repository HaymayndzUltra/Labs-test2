import { PromptTemplate } from 'langchain/prompts';

export const proposalPrompt = new PromptTemplate({
  inputVariables: ['persona', 'pod', 'kpis'],
  template: `Draft a concise Upwork proposal for {persona} highlighting {pod} dashboards and KPIs: {kpis}.`,
});

export async function buildPrompt(persona: string, pod: string, kpis: string[]) {
  return proposalPrompt.format({ persona, pod, kpis: kpis.join(', ') });
}
