import EventEmitter from "../../../../../deps/events.ts";
import { Router } from "../../../../../deps/oak.ts";
import GameMemRepository from "../../../../infrastructure/persistence/memory/GameMemRepository.ts";
import PlayerMemRepository from "../../../../infrastructure/persistence/memory/PlayerMemRepository.ts";
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

const gameSocketAppService = new GameSocketAppService(
  new GameMemRepository(),
  new PlayerMemRepository(),
);

class SocketPresenter implements Presenter {
  private ws: WebSocket;
  constructor(ws: WebSocket) {
    this.ws = ws;
  }

  public onMessage(msg: string): void {
    if (this.ws.readyState !== this.ws.OPEN) {
      return;
    }
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
  const playerId = crypto.randomUUID();

  gameSocketAppService.createPlayer(playerId, gameId, "Hello World");

  const presenter = new SocketPresenter(ws);

  const onopen = () => {
    gameSocketAppService.queryGame(presenter, gameId);
    gameSocketAppService.queryPlayers(presenter, gameId);
  };
  ws.onopen = onopen;

  const onmessage = (ev: MessageEvent<string>) => {
    const request: RequestDto = JSON.parse(ev.data);
    if (request.type === RequestDtoType.MovePlayer) {
      gameSocketAppService.movePlayer(
        gameId,
        playerId,
        request.direction,
      );
      eventBus.emit("players_updated");
    } else if (request.type === RequestDtoType.RevealArea) {
      gameSocketAppService.revealArea(
        gameId,
        playerId,
      );
      eventBus.emit("game_updated");
    } else if (request.type === RequestDtoType.FlagArea) {
      gameSocketAppService.flagArea(
        gameId,
        playerId,
      );
      eventBus.emit("game_updated");
    }
  };
  ws.onmessage = onmessage;

  const onclose = () => {
    gameSocketAppService.removePlayer(playerId);
    eventBus.emit("players_updated");
  };
  ws.onclose = onclose;

  eventBus.on("game_updated", () => {
    gameSocketAppService.queryGame(presenter, gameId);
  });

  eventBus.on("players_updated", () => {
    gameSocketAppService.queryPlayers(presenter, gameId);
  });
});

export { router };
