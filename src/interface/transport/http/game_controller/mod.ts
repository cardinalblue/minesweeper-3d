import { Router } from "../../../../../deps/oak.ts";
import GameMemRepository from "../../../../infrastructure/persistence/memory/GameMemRepository.ts";
import { Service as GameSocketAppService } from "../../../../application/app_service/GameSocketAppService/mod.ts";

// const gameSocketAppService = new GameSocketAppService(new GameMemRepository());

const router = new Router({
  prefix: "/game",
});

// router.post("/", (ctx) => {
//   const newGame = gameSocketAppService.createGame();
//   ctx.response.body = newGame;
// });

export { router };
