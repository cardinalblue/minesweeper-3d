import { PositionVo } from "../common_model/mod.ts";

export default class SizeVo {
  private width: number;
  private height: number;
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  public range(callback: (x: number, z: number) => void) {
    for (let x = 0; x < this.width; x += 1) {
      for (let z = 0; z < this.height; z += 1) {
        callback(x, z);
      }
    }
  }

  public getWidth() {
    return this.width;
  }

  public getHeight() {
    return this.height;
  }

  public includePos(position: PositionVo): boolean {
    const x = position.getX();
    const z = position.getZ();
    if (x < 0 || x >= this.width || z < 0 || z >= this.height) {
      return false;
    }
    return true;
  }
}
