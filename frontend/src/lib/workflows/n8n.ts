export type WorkflowPayload = {
  persona: string;
  intakeId: string;
  email: string;
  proposalUrl: string;
};

export const triggerN8nWorkflow = async (payload: WorkflowPayload) => {
  console.info('[n8n] Workflow stub triggered', payload);
  return { status: 'queued', workflowId: 'upwork-portfolio-demo' } as const;
};
