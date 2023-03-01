import { PositionVoDto } from "../../dto/mod.ts";

enum RequestDtoType {
  RevealArea = "REVEAL_AREA",
  FlagArea = "FLAG_AREA",
}

type RevealAreaRequestDto = {
  type: RequestDtoType.RevealArea;
  position: PositionVoDto;
};

type FlagAreaRequestDto = {
  type: RequestDtoType.FlagArea;
  position: PositionVoDto;
};

type RequestDto = RevealAreaRequestDto | FlagAreaRequestDto;

export type { RequestDto };
export { RequestDtoType };
