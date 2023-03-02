import { GameAggDto, PlayerAggDto } from "../../dto/mod.ts";

enum ResponseDtoType {
  GameUpdated = "GAME_UPDATED",
  PlayersUpdated = "PLAYERS_UPDATED",
}

type GameUpdatedResponseDto = {
  type: ResponseDtoType.GameUpdated;
  game: GameAggDto;
};

type PlayersUpdatedResponseDto = {
  type: ResponseDtoType.PlayersUpdated;
  players: PlayerAggDto[];
};

export { ResponseDtoType };
export type { GameUpdatedResponseDto, PlayersUpdatedResponseDto };
