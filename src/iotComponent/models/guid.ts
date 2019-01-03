export class Guid {

  GetGUID(): string {
      return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  Guid(): string {
    return this.GetGUID() + this.GetGUID() + '-' + this.GetGUID()
    + '-' + this.GetGUID() + '-' + this.GetGUID() + '-' + this.GetGUID() + this.GetGUID() + this.GetGUID();
  }
}
