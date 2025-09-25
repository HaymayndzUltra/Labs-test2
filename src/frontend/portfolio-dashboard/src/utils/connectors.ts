export interface ConnectorResponse<T> {
  data: T;
  lastSynced: string;
  status: 'ok' | 'error';
}

export async function mockSnowflakeQuery<T>(payload: T): Promise<ConnectorResponse<T>> {
  await new Promise((resolve) => setTimeout(resolve, 120));
  return {
    data: payload,
    lastSynced: new Date().toISOString(),
    status: 'ok'
  };
}

export async function mockWebhookDelivery(event: string) {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return {
    event,
    idempotencyKey: crypto.randomUUID(),
    signature: 'sha256=mock-signature',
    deliveredAt: new Date().toISOString()
  };
}

export async function mockSseStream<T>(callback: (event: T) => void, events: T[]) {
  events.forEach((event, index) => {
    setTimeout(() => callback(event), 200 * index);
  });
}
