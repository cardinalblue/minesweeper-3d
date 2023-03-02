import { Router } from "../../../../../deps/oak.ts";
import PlayerMemRepository from "../../../../infrastructure/persistence/memory/PlayerMemRepository.ts";
import { Service as PlayerHttpAppService } from "../../../../application/app_service/PlayerHttpAppService/mod.ts";
import type { Presenter } from "../../../../application/app_service/PlayerHttpAppService/mod.ts";

class HttpPresenter implements Presenter {
  private ctx: any;
  constructor(ctx: any) {
    this.ctx = ctx;
  }

  public onSuccess(msg: string): void {
    this.ctx.response.body = msg;
  }
}

const playerHttpAppService = new PlayerHttpAppService(
  new PlayerMemRepository(),
);

const router = new Router({
  prefix: "/game/:gameId/player",
});

router.post("/", async (ctx) => {
  const body = await ctx.request.body().value;
  const gameId = ctx.params.gameId as string;
  const name = body.name;
  playerHttpAppService.createPlayer(
    new HttpPresenter(ctx),
    gameId,
    name,
  );
});

export { router };
