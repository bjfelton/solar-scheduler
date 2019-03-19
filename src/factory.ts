import {Interval} from './interval';
import {BaseSchedule} from './base';
import {SimpleTimer} from './on-off';

interface PartialConfig {
  type: string;
}

export class ScheduleFactory {
  static createSchedule(config: PartialConfig): BaseSchedule {
    switch (config.type) {
      case 'interval':
        return new Interval(config);
    }
  }
}
