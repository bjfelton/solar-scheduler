import {BaseSchedule} from './base';
import {execSync} from 'child_process';

abstract class Timer extends BaseSchedule {
  public onCommand: string;
  public offCommand: string;

  protected constructor(init?: Partial<Timer>) {
    super(init);

    this.onCommand  = init.onCommand;
    this.offCommand = init.offCommand;
  }
}

export class SimpleTimer extends Timer {
  public onTime: string;
  public offTime: string;
  private on: number;
  private off: number;

  constructor(init?: Partial<SimpleTimer>) {
    super(init);
    const onParts  = init.onTime ? init.onTime.split(':') : [0, 0];
    const offParts = init.offTime ? init.offTime.split(':') : [0, 0];
    this.on        = Number(onParts[0]) * 60 + Number(onParts[1]);
    this.off       = Number(offParts[0]) * 60 + Number(offParts[1]);
  }

  schedule(): void {
    const offOnOff = [this.offCommand, this.onCommand, this.offCommand];
    const onOffOn  = [this.onCommand, this.offCommand, this.onCommand];

    const fullNow = new Date();
    const now     = fullNow.getHours() * 60 + fullNow.getMinutes();
    if (now < this.on && this.on < this.off) {
      SimpleTimer.assertState(offOnOff, this.on - now, this.off - now, fullNow);
    } else if (this.on < now && now < this.off) {
      SimpleTimer.assertState(onOffOn, this.off - now, 1440 - now + this.on, fullNow);
    } else if (this.on < this.off && this.off < now) {
      SimpleTimer.assertState(offOnOff, 1440 - now + this.on, 1440 - now + this.off, fullNow);
    } else if (now < this.off && this.off < this.on) {
      SimpleTimer.assertState(onOffOn, this.off - now, this.on - now, fullNow);
    } else if (this.off < now && now < this.on) {
      SimpleTimer.assertState(offOnOff, this.on - now, 1440 - now + this.off, fullNow);
    } else if (this.off < this.on && this.on < now) {
      SimpleTimer.assertState(onOffOn, 1440 - now + this.off, 1440 - now + this.on, fullNow);
    }
  }

  private static assertState(commands: string[], offset1: number, offset2: number, origDate: Date): void {
    execSync(commands[0]);
    setTimeout(() => {
      execSync(commands[1]);
      setInterval(() => execSync(commands[1]), 86400000);
    }, offset1 * 60 * 1000 - (origDate.getSeconds() * 1000 + origDate.getMilliseconds()));
    setTimeout(() => {
      execSync(commands[2]);
      setInterval(() => execSync(commands[2]), 86400000);
    }, offset2 * 60 * 1000 - (origDate.getSeconds() * 1000 + origDate.getMilliseconds()));
  }
}
