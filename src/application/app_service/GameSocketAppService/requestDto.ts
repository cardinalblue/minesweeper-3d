import type { DirectionVoDto, PositionVoDto } from "../../dto/mod.ts";

enum RequestDtoType {
  MovePlayer = "MOVE_PLAYER",
  RevealArea = "REVEAL_AREA",
  FlagArea = "FLAG_AREA",
  ChangeCamera = "CHANGE_CAMERA",
  ResetGame = "RESET_GAME",
}

type MovePlayerRequestDto = {
  type: RequestDtoType.MovePlayer;
  direction: DirectionVoDto;
};

type FlagAreaRequestDto = {
  type: RequestDtoType.FlagArea;
  position: PositionVoDto;
};

type ChangeCameraRequestDto = {
  type: RequestDtoType.ChangeCamera;
};

type ResetGameRequestDto = {
  type: RequestDtoType.ResetGame;
};

type RequestDto =
  | MovePlayerRequestDto
  | FlagAreaRequestDto
  | ChangeCameraRequestDto
  | ResetGameRequestDto;

export type { RequestDto };
export { RequestDtoType };
