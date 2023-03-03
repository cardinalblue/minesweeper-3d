import { GameAggDto, PlayerAggDto } from "../../dto/mod.ts";

enum ResponseDtoType {
  NotificationSent = "NOTIFICATION_SENT",
  GameUpdated = "GAME_UPDATED",
  PlayersUpdated = "PLAYERS_UPDATED",
}

type NotificationSentResponseDto = {
  type: ResponseDtoType.NotificationSent;
  message: string;
};

type GameUpdatedResponseDto = {
  type: ResponseDtoType.GameUpdated;
  game: GameAggDto;
};

type PlayersUpdatedResponseDto = {
  type: ResponseDtoType.PlayersUpdated;
  players: PlayerAggDto[];
  myPlayerId: string;
};

export { ResponseDtoType };
export type {
  GameUpdatedResponseDto,
  NotificationSentResponseDto,
  PlayersUpdatedResponseDto,
};
