import * as fs from 'fs';
import {ScheduleFactory} from './factory';

const rules = JSON.parse(fs.readFileSync('./rules.json').toString());
for (let rule of rules) {
  const thing = ScheduleFactory.createSchedule(rule);
  thing.schedule();
}

