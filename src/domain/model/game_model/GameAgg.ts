import AreaVo from "./AreaVo.ts";
import SizeVo from "./SizeVo.ts";
import { PositionVo } from "../common_model/mod.ts";

type GameStatus = "SLEEPING" | "IN_PROGRESS" | "SUCCEEDED" | "FAILED";
export default class GameAgg {
  private id: string;
  private size: SizeVo;
  private minesCount: number;
  private areas: AreaVo[][];
  private placedMinesCount: number;
  private status: GameStatus;
  private camera: 0 | 1 | 2 | 3 | 4;

  constructor(id: string, size: SizeVo, minesCount: number) {
    this.id = id;
    this.size = size;
    this.minesCount = minesCount;
    this.placedMinesCount = 0;
    this.status = "SLEEPING";
    this.camera = 0;

    this.areas = this.generateNewAreas();
  }

  public isEnded() {
    return this.status === "SUCCEEDED" || this.status === "FAILED";
  }

  public generateNewAreas() {
    const newAreas: AreaVo[][] = [];
    this.size.range((x, y) => {
      if (newAreas[x] === undefined) {
        newAreas.push([]);
      }
      newAreas[x][y] = new AreaVo(false, false, false, 0, false);
    });
    return newAreas;
  }

  public reset() {
    this.placedMinesCount = 0;
    this.status = "SLEEPING";
    this.areas = this.generateNewAreas();
  }

  private isPosOutsideField(pos: PositionVo): boolean {
    const [x, z] = [pos.getX(), pos.getZ()];
    return x < 0 || x >= this.size.getWidth() || z < 0 ||
      z >= this.size.getHeight();
  }

  private setArea(pos: PositionVo, area: AreaVo) {
    this.areas[pos.getX()][pos.getZ()] = area;
  }

  public getArea(pos: PositionVo): AreaVo {
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

  private placeMines(exceptPos: PositionVo) {
    while (this.placedMinesCount < this.minesCount) {
      const x: number = Math.floor(Math.random() * this.size.getWidth());
      const z: number = Math.floor(Math.random() * this.size.getHeight());
      const pos: PositionVo = new PositionVo(x, z);
      const area = this.getArea(pos);
      if (area.getHasMine() || area.getRevealed() || exceptPos.isEqual(pos)) {
        continue;
      }

      this.placeMine(pos);
    }
  }

  public getId(): string {
    return this.id;
  }

  public getSize(): SizeVo {
    return this.size;
  }

  public getCamera(): 0 | 1 | 2 | 3 | 4 {
    return this.camera;
  }

  public changeCamera() {
    this.camera = (this.camera + 1) % 5 as 0 | 1 | 2 | 3 | 4;
  }

  public getMinesCount(): number {
    return this.minesCount;
  }

  public getStatus(): GameStatus {
    return this.status;
  }

  public getAreas(): AreaVo[][] {
    return this.areas;
  }

  public revealArea(pos: PositionVo) {
    if (this.isPosOutsideField(pos)) return;
    if (this.status === "SLEEPING") {
      this.placeMines(pos);
    }
    this.status = "IN_PROGRESS";

    const visitedAreaMap: { [posKey: string]: true } = {};
    const minesToReveal: PositionVo[] = [];
    minesToReveal.push(pos);

    const targetArea = this.getArea(pos);

    if (targetArea.getHasMine()) {
      this.setArea(pos, targetArea.setRevealed(true).setBoomed(true));
      this.status = "FAILED";
    } else if (targetArea.getAdjMinesCount() === 0) {
      while (minesToReveal.length > 0) {
        // @ts-ignore Weird TS complaints, need to sort this out later.
        const nextPos: PositionVo = minesToReveal.pop();
        const posKey = `${nextPos.getX()},${nextPos.getZ()}`;

        const isAreaVisited = visitedAreaMap[posKey];
        if (!isAreaVisited) {
          visitedAreaMap[posKey] = true;
          const nextArea = this.getArea(nextPos);
          const hasMine = nextArea.getHasMine();
          const flagged = nextArea.getFlagged();
          const revealed = nextArea.getRevealed();
          const adjMinesCount = nextArea.getAdjMinesCount();
          const doNotRevealThisArea = hasMine || revealed || flagged;
          if (!doNotRevealThisArea) {
            this.setArea(nextPos, nextArea.setRevealed(true));

            const shallKeepTraversing = adjMinesCount === 0;
            if (shallKeepTraversing) {
              this.traverseAdjAreas(nextPos, (adjAreaPos: PositionVo) => {
                minesToReveal.unshift(adjAreaPos);
              });
            }
          }
        }
      }
    } else {
      this.setArea(pos, targetArea.setRevealed(true));
    }
  }

  public flagArea(pos: PositionVo) {
    if (this.isPosOutsideField(pos)) return;

    const area = this.getArea(pos);
    if (area.getRevealed()) {
      return;
    }

    this.setArea(
      pos,
      this.getArea(pos).setFlagged(!area.getFlagged()),
    );
  }
}
