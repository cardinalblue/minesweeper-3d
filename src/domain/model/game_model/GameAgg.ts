import AreaVo from "./AreaVo.ts";
import PositionVo from "./PositionVo.ts";
import SizeVo from "./SizeVo.Ts";

export default class GameAgg {
  private id: string;
  private size: SizeVo;
  private minesCount: number;
  private areas: AreaVo[][];
  private revealedAreaCount: number;
  private placedMinesCount: number;

  constructor(id: string, size: SizeVo, minesCount: number) {
    this.id = id;
    this.size = size;
    this.minesCount = minesCount;
    this.revealedAreaCount = 0;
    this.placedMinesCount = 0;

    const newAreas: AreaVo[][] = [];
    size.range((x, y) => {
      if (newAreas[x] === undefined) {
        newAreas.push([]);
      }
      newAreas[x][y] = new AreaVo(false, false, false, 0);
    });
    this.areas = newAreas;
  }

  private isPosOutsideField(pos: PositionVo): boolean {
    const [x, z] = [pos.getX(), pos.getZ()];
    return x < 0 || x >= this.size.getWidth() || z < 0 ||
      z >= this.size.getHeight();
  }

  private setArea(pos: PositionVo, area: AreaVo) {
    this.areas[pos.getX()][pos.getZ()] = area;
  }

  private getArea(pos: PositionVo): AreaVo {
    return this.areas[pos.getX()][pos.getZ()];
  }

  private traverseAdjAreas(
    pos: PositionVo,
    callback: (pos: PositionVo, area: AreaVo) => void,
  ) {
    const [x, z] = [pos.getX(), pos.getZ()];
    for (let i = x - 1; i <= x + 1; i += 1) {
      for (let j = z - 1; j <= z + 1; j += 1) {
        const isCenterCoord = i === x && j === z;
        if (isCenterCoord) continue;

        const targetPos = new PositionVo(i, j);
        if (this.isPosOutsideField(targetPos)) continue;

        callback(targetPos, this.getArea(targetPos));
      }
    }
  }

  private placeMine(pos: PositionVo) {
    this.setArea(pos, this.getArea(pos).setHasMine(true));
    this.traverseAdjAreas(pos, (targetPos, targetArea) => {
      this.setArea(
        targetPos,
        targetArea.setAdjMinesCount(targetArea.getAdjMinesCount() + 1),
      );
    });
    this.placedMinesCount += 1;
  }

  private placeMines() {
    if (this.revealedAreaCount !== 1) {
      return;
    }
    while (this.placedMinesCount < this.minesCount) {
      const x: number = Math.floor(Math.random() * this.size.getWidth());
      const z: number = Math.floor(Math.random() * this.size.getHeight());
      const pos: PositionVo = new PositionVo(x, z);
      const area = this.getArea(pos);
      if (area.hasMine() || area.isRevealed()) continue;

      this.placeMine(pos);
    }
  }

  public getId(): string {
    return this.id;
  }

  public getAreas(): AreaVo[][] {
    return this.areas;
  }

  public revealArea(pos: PositionVo) {
    if (this.isPosOutsideField(pos)) return;

    this.setArea(
      pos,
      this.getArea(pos).setRevealed(true),
    );
    this.revealedAreaCount += 1;

    if (this.revealedAreaCount === 1) {
      this.placeMines();
    }
  }
}
