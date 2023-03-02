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

type FlagAreaRequestDto = {
  type: RequestDtoType.FlagArea;
  position: PositionVoDto;
};

type RequestDto =
  | MovePlayerRequestDto
  | FlagAreaRequestDto;

export type { RequestDto };
export { RequestDtoType };
