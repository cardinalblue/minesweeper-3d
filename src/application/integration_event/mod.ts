interface IntegrationEventPublisher {
  publish(event: string, msg?: string): void;
}

interface IntegrationEventSubscriber {
  subscribe(event: string, cb: (msg?: string) => void): () => void;
}

export type { IntegrationEventPublisher, IntegrationEventSubscriber };
