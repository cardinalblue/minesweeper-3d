import { eventBus } from "../../../common/mod.ts";

import type { IntegrationEventSubscriber } from "../../../application/integration_event/mod.ts";

export class MemIntegrationEventSubscriber
  implements IntegrationEventSubscriber {
  subscribe(event: string, cb: (msg?: string) => void): () => void {
    eventBus.on(event, cb);

    return () => {
      eventBus.removeListener(event, cb);
    };
  }
}
