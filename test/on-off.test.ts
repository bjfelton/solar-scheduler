import {SimpleTimer} from '../src/on-off';
import * as faker from 'faker';
import * as child_process from 'child_process';
import {advanceTo, advanceBy} from 'jest-date-mock';

describe.only('interval tests', () => {
  let execSyncSpy;

  beforeEach(() => {
    jest.useFakeTimers();
    execSyncSpy = jest.spyOn(child_process, 'execSync').mockReturnValue(Buffer.from(''));
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.resetAllMocks();
  });

  describe('assertions', () => {
    beforeEach(() => {
      execSyncSpy = jest.spyOn(child_process, 'execSync').mockReturnValue(Buffer.from(''));
    });

    [
      {onTime: '01:00', offTime: '02:00', runFirst: 'off', offset: 0, gapToOn: 60, gapToOff: 120},
      {onTime: '01:00', offTime: '02:00', runFirst: 'on', offset: 3660, gapToOn: 1439, gapToOff: 59},
      {onTime: '01:00', offTime: '02:00', runFirst: 'off', offset: 7260, gapToOn: 1379, gapToOff: 1439},
      {onTime: '02:00', offTime: '01:00', runFirst: 'on', offset: 0, gapToOn: 120, gapToOff: 60},
      {onTime: '02:00', offTime: '01:00', runFirst: 'off', offset: 3660, gapToOn: 59, gapToOff: 1439},
      {onTime: '02:00', offTime: '01:00', runFirst: 'on', offset: 7260, gapToOn: 1439, gapToOff: 1379},
    ].forEach(tc => {
      test('runs expected command to assert state', () => {
        advanceTo(tc.offset * 1000);
        const testObject = new SimpleTimer(Object.assign(tc, {onCommand: 'on', offCommand: 'off'}));
        testObject.schedule();

        expect(execSyncSpy).toBeCalledWith(tc.runFirst);
      });

      test('sets timeouts for initial on and off commands', () => {
        advanceTo(tc.offset * 1000);
        const testObject = new SimpleTimer(Object.assign(tc, {onCommand: 'on', offCommand: 'off'}));
        testObject.schedule();

        if (tc.gapToOn < tc.gapToOff) {
          advanceBy(tc.gapToOn * 60 * 1000);
          jest.advanceTimersByTime(tc.gapToOn * 60 * 1000);
          expect(execSyncSpy).toHaveBeenLastCalledWith('on');
          expect(execSyncSpy).toHaveBeenCalledTimes(2);

          advanceBy((tc.gapToOff - tc.gapToOn) * 60 * 1000);
          jest.advanceTimersByTime((tc.gapToOff - tc.gapToOn) * 60 * 1000);
          expect(execSyncSpy).toHaveBeenLastCalledWith('off');
          expect(execSyncSpy).toHaveBeenCalledTimes(3);
        } else {
          advanceBy(tc.gapToOff * 60 * 1000);
          jest.advanceTimersByTime(tc.gapToOff * 60 * 1000);
          expect(execSyncSpy).toHaveBeenLastCalledWith('off');
          expect(execSyncSpy).toHaveBeenCalledTimes(2);

          advanceBy((tc.gapToOn - tc.gapToOff) * 60 * 1000);
          jest.advanceTimersByTime((tc.gapToOn - tc.gapToOff) * 60 * 1000);
          expect(execSyncSpy).toHaveBeenLastCalledWith('on');
          expect(execSyncSpy).toHaveBeenCalledTimes(3);
        }
      });

      test('sets intervals for on and off commands after initial timeout', () => {
        advanceTo(tc.offset * 1000);
        const testObject = new SimpleTimer(Object.assign(tc, {onCommand: 'on', offCommand: 'off'}));
        testObject.schedule();
        if (tc.gapToOn < tc.gapToOff) {
          advanceBy(tc.gapToOn * 60 * 1000);
          jest.advanceTimersByTime(tc.gapToOn * 60 * 1000 + 86400000);
          expect(execSyncSpy).toHaveBeenLastCalledWith('on');
          expect(execSyncSpy).toHaveBeenCalledTimes(4);

          advanceBy((tc.gapToOff - tc.gapToOn) * 60 * 1000);
          jest.advanceTimersByTime((tc.gapToOff - tc.gapToOn) * 60 * 1000);
          expect(execSyncSpy).toHaveBeenLastCalledWith('off');
          expect(execSyncSpy).toHaveBeenCalledTimes(5);
        } else {
          advanceBy(tc.gapToOff * 60 * 1000);
          jest.advanceTimersByTime(tc.gapToOff * 60 * 1000 + 86400000);
          expect(execSyncSpy).toHaveBeenLastCalledWith('off');
          expect(execSyncSpy).toHaveBeenCalledTimes(4);

          advanceBy((tc.gapToOn - tc.gapToOff) * 60 * 1000);
          jest.advanceTimersByTime((tc.gapToOn - tc.gapToOff) * 60 * 1000);
          expect(execSyncSpy).toHaveBeenLastCalledWith('on');
          expect(execSyncSpy).toHaveBeenCalledTimes(5);
        }
      });
    });
  });

  test.skip('executes provided command on expected interval', () => {
    const onCommand = faker.lorem.words();

    const testObject = new SimpleTimer({onTime: '01:00', onCommand: onCommand});
    testObject.schedule();

    expect(execSyncSpy).not.toHaveBeenCalled();
    jest.advanceTimersByTime(60 * 1000);
    expect(execSyncSpy).toBeCalledWith(onCommand);
  });
});
