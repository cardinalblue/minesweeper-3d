import EventEmitter from "../../deps/events.ts";

class EventBus extends EventEmitter {}
const eventBus = new EventBus();

export { eventBus };
