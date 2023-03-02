export default class PositionVo {
  private x: number;
  private z: number;
  constructor(x: number, z: number) {
    this.x = x;
    this.z = z;
  }

  public getX() {
    return this.x;
  }

  public getZ() {
    return this.z;
  }

  public shift(deltaX: number, deltaZ: number) {
    return new PositionVo(this.x + deltaX, this.z + deltaZ);
  }
}
