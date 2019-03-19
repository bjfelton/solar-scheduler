import {Interval} from '../src/interval';
import * as faker from 'faker';
import * as child_process from 'child_process';

describe('interval tests', () => {
  let execSyncSpy;

  beforeEach(() => {
    jest.useFakeTimers();
    execSyncSpy = jest.spyOn(child_process, 'execSync').mockReturnValue(Buffer.from(''));
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.resetAllMocks();
  });

  test('executes provided command on expected interval', () => {
    const timer   = faker.random.number();
    const command = faker.lorem.words();

    const testObject = new Interval({intervalMs: timer, command: command});
    testObject.schedule();

    expect(execSyncSpy).not.toHaveBeenCalled();
    jest.advanceTimersByTime(timer);
    expect(execSyncSpy).toBeCalledWith(command);
  });
});
