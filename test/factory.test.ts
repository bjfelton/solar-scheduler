import {ScheduleFactory} from '../src/factory';
import {Interval} from '../src/interval';
import {SimpleTimer} from '../src/on-off';

describe('factory', () => {
  [
    {type: 'interval', class: Interval},
    {type: 'simpleTimer', class: SimpleTimer},
  ].forEach(tc => {
    test(`returns expected class for type ${tc.type}`, () => {
      const actual = ScheduleFactory.createSchedule({type: tc.type});
      expect(actual).toBeInstanceOf(tc.class)
    });
  });
});
