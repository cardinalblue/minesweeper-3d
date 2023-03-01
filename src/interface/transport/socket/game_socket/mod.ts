import EventEmitter from "../../../../../deps/events.ts";
import { Router } from "../../../../../deps/oak.ts";
import GameMemRepository from "../../../../infrastructure/persistence/memory/GameMemRepository.ts";
import {
  Service as GameSocketAppService,
} from "../../../../application/app_service/GameSocketAppService/mod.ts";
import type {
  Presenter,
  RequestDto,
} from "../../../../application/app_service/GameSocketAppService/mod.ts";
import {
  RequestDtoType,
} from "../../../../application/app_service/GameSocketAppService/mod.ts";

class EventBus extends EventEmitter {}
const eventBus = new EventBus();

const gameSocketAppService = new GameSocketAppService(new GameMemRepository());

class SocketPresenter implements Presenter {
  private ws: WebSocket;
  constructor(ws: WebSocket) {
    this.ws = ws;
  }

  public onMessage(msg: string): void {
    this.ws.send(msg);
  }
}

const router = new Router({
  prefix: "/game-client",
});

router.get("/:id", (ctx) => {
  if (!ctx.isUpgradable) {
    ctx.throw(501);
  }
  const ws = ctx.upgrade();

  const gameId = ctx.params.id;

  const presenter = new SocketPresenter(ws);

  const onopen = () => {
    gameSocketAppService.queryGame(presenter, gameId);
  };
  ws.onopen = onopen;

  const onmessage = (ev: MessageEvent<string>) => {
    const request: RequestDto = JSON.parse(ev.data);
    if (request.type === RequestDtoType.RevealArea) {
      gameSocketAppService.revealArea(
        gameId,
        request.position.x,
        request.position.z,
      );
      eventBus.emit("updated");
    } else if (request.type === RequestDtoType.FlagArea) {
      gameSocketAppService.flagArea(
        gameId,
        request.position.x,
        request.position.z,
      );
      eventBus.emit("updated");
    }
  };
  ws.onmessage = onmessage;

  const onclose = () => {
  };
  ws.onclose = onclose;

  eventBus.on("updated", () => {
    gameSocketAppService.queryGame(presenter, gameId);
  });
});

export { router };
