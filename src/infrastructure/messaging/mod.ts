import { eventBus } from "../../common/mod.ts";

import type { IntegrationEventPublisher } from "../../application/integration_event/mod.ts";

export class MemIntegrationEventPublisher implements IntegrationEventPublisher {
  publish(event: string): void {
    eventBus.emit(event);
  }
}
