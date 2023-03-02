import { Router } from "../../../../../deps/oak.ts";
import GameMemRepository from "../../../../infrastructure/persistence/memory/GameMemRepository.ts";
import PlayerMemRepository from "../../../../infrastructure/persistence/memory/PlayerMemRepository.ts";
import {
  IntegrationEvent,
  Service as GameSocketAppService,
} from "../../../../application/app_service/GameSocketAppService/mod.ts";
import type {
  Presenter,
  RequestDto,
} from "../../../../application/app_service/GameSocketAppService/mod.ts";
import {
  RequestDtoType,
} from "../../../../application/app_service/GameSocketAppService/mod.ts";
import { MemIntegrationEventSubscriber } from "../../messaging/mod.ts";
import { MemIntegrationEventPublisher } from "../../../../infrastructure/messaging/mod.ts";

const gameSocketAppService = new GameSocketAppService(
  new GameMemRepository(),
  new PlayerMemRepository(),
  new MemIntegrationEventPublisher(),
);
gameSocketAppService.createGame();

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
  const myPlayerId = crypto.randomUUID();

  const presenter = new SocketPresenter(ws);
  const integrationSusbscriber = new MemIntegrationEventSubscriber();

  const onopen = () => {
    gameSocketAppService.queryGame(presenter, gameId);
    gameSocketAppService.addPlayer(myPlayerId, gameId, "Hello World");
    gameSocketAppService.queryPlayers(presenter, gameId, myPlayerId);
  };
  ws.onopen = onopen;

  const onmessage = (ev: MessageEvent<string>) => {
    const request: RequestDto = JSON.parse(ev.data);
    if (request.type === RequestDtoType.MovePlayer) {
      gameSocketAppService.movePlayer(
        gameId,
        myPlayerId,
        request.direction,
      );
    } else if (request.type === RequestDtoType.FlagArea) {
      gameSocketAppService.flagArea(
        gameId,
        myPlayerId,
      );
    } else if (request.type === RequestDtoType.ChangeCamera) {
      gameSocketAppService.changeCamera(
        gameId,
      );
    } else if (request.type === RequestDtoType.ResetGame) {
      gameSocketAppService.resetGame(
        gameId,
      );
    }
  };
  ws.onmessage = onmessage;

  const onclose = () => {
    gameSocketAppService.removePlayer(myPlayerId);
  };
  ws.onclose = onclose;

  integrationSusbscriber.subscribe(IntegrationEvent.GameUpdated, () => {
    gameSocketAppService.queryGame(presenter, gameId);
  });

  integrationSusbscriber.subscribe(IntegrationEvent.PlayersUpdated, () => {
    gameSocketAppService.queryPlayers(presenter, gameId, myPlayerId);
  });
});

export { router };
