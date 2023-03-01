import { Router } from "../../../../../deps/oak.ts";
import GameMemRepository from "../../../../infrastructure/persistence/memory/GameMemRepository.ts";
import GameService from "../../../../domain/service/GameService.ts";
import PositionVo from "../../../../domain/model/game_model/PositionVo.ts";

const gameMemRepository = new GameMemRepository();
const gameService = new GameService(new GameMemRepository());
gameService.createGame("739ea924-f33a-4c16-b1fa-91ae971de29e");
gameService.revealArea(
  "739ea924-f33a-4c16-b1fa-91ae971de29e",
  new PositionVo(0, 0),
);

const router = new Router({
  prefix: "/game",
});

router.get("/", (ctx) => {
  ctx.response.body = gameMemRepository.get(
    "739ea924-f33a-4c16-b1fa-91ae971de29e",
  );
});

export { router };
