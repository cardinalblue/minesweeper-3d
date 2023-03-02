import { rangeMatrix } from "../../lib/mod.ts";
import { GameAgg } from "../../domain/model/game_model/mod.ts";
import { DirectionVo, PlayerAgg } from "../../domain/model/player_model/mod.ts";
import { PositionVo } from "../../domain/model/common_model/mod.ts";

type PositionVoDto = {
  x: number;
  z: number;
};

export const newPositionVoDto = (position: PositionVo): PositionVoDto => {
  return {
    x: position.getX(),
    z: position.getZ(),
  };
};

type DirectionVoDto = number;

export const newDirectionVoDto = (direction: DirectionVo): DirectionVoDto => {
  return direction.toNumber();
};

type SizeVoDto = {
  width: number;
  height: number;
};

type AreaVoDto = {
  revealed: boolean;
  flagged: boolean;
  hasMine: boolean;
  adjMinesCount: number;
};

type GameAggDto = {
  id: string;
  size: SizeVoDto;
  minesCount: number;
  areas: AreaVoDto[][];
};

export const newGameAggDto = (game: GameAgg): GameAggDto => {
  return {
    id: game.getId(),
    size: {
      width: game.getSize().getWidth(),
      height: game.getSize().getHeight(),
    },
    minesCount: game.getMinesCount(),
    areas: rangeMatrix(game.getAreas(), (area) => ({
      revealed: area.getRevealed(),
      flagged: area.getFlagged(),
      hasMine: area.getHasMine(),
      adjMinesCount: area.getAdjMinesCount(),
    })),
  };
};

type PlayerAggDto = {
  id: string;
  gameId: string;
  name: string;
  position: PositionVoDto;
  direction: DirectionVoDto;
};

export const newPlayerAggDto = (player: PlayerAgg): PlayerAggDto => {
  return {
    id: player.getId(),
    gameId: player.getGameId(),
    name: player.getName(),
    position: newPositionVoDto(player.getPosition()),
    direction: newDirectionVoDto(player.getDirection()),
  };
};

export type { GameAggDto, PlayerAggDto, PositionVoDto };
