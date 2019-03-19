export abstract class BaseSchedule {
  public name: string;
  public type: string;
  public offsetSeconds: number;

  protected constructor(init?: Partial<BaseSchedule>) {
    this.name = init.name;
    this.type = init.type;
    this.offsetSeconds = init.offsetSeconds;
  }

  abstract schedule();
}

