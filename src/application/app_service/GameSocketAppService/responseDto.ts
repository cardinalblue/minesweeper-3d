import { GameAggDto } from "../../dto/mod.ts";

enum ResponseDtoType {
  GameUpdated = "GAME_UPDATED",
}

type GameUpdatedResponseDto = {
  type: ResponseDtoType.GameUpdated;
  game: GameAggDto;
};

export { ResponseDtoType };
export type { GameUpdatedResponseDto };
