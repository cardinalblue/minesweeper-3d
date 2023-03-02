interface IntegrationEventPublisher {
  publish(event: string): void;
}

interface IntegrationEventSubscriber {
  subscribe(event: string, cb: () => void): void;
}

export type { IntegrationEventPublisher, IntegrationEventSubscriber };
