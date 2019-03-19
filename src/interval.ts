import {BaseSchedule} from './base';
import {execSync} from 'child_process';

export class Interval extends BaseSchedule {
  public intervalMs: number;
  public command: string;

  constructor(init?: Partial<Interval>) {
    super(init);
    this.intervalMs = init.intervalMs;
    this.command    = init.command;
  }

  schedule() {
    setInterval(() => execSync(this.command), this.intervalMs);
  }
}
