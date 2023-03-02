import type { DirectionVoDto, PositionVoDto } from "../../dto/mod.ts";

enum RequestDtoType {
  MovePlayer = "MOVE_PLAYER",
  RevealArea = "REVEAL_AREA",
  FlagArea = "FLAG_AREA",
}

type MovePlayerRequestDto = {
  type: RequestDtoType.MovePlayer;
  direction: DirectionVoDto;
};

type RevealAreaRequestDto = {
  type: RequestDtoType.RevealArea;
  position: PositionVoDto;
};

type FlagAreaRequestDto = {
  type: RequestDtoType.FlagArea;
  position: PositionVoDto;
};

type RequestDto =
  | MovePlayerRequestDto
  | RevealAreaRequestDto
  | FlagAreaRequestDto;

export type { RequestDto };
export { RequestDtoType };
