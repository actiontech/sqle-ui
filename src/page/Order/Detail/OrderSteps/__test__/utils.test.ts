import moment from 'moment';
import { checkTimeInWithMaintenanceTime } from '../utils';
const realDateNow = Date.now.bind(global.Date);

const genMaintenanceTime = (arr: Array<Array<number>>) => {
  if (arr.length === 0) return [];
  return arr.map(([$1, $2, $3, $4]) => {
    return {
      maintenance_start_time: { hour: $1, minute: $2 },
      maintenance_stop_time: { hour: $3, minute: $4 },
    };
  });
};

describe('test OrderSteps/utils', () => {
  test('should return expect value', () => {
    const dateNowStub = jest.fn(() => new Date('2022-07-21T12:33:37.000Z')); //20:33
    global.Date.now = dateNowStub as any;

    expect(checkTimeInWithMaintenanceTime(moment(), [])).toBeTruthy();
    expect(
      checkTimeInWithMaintenanceTime(
        moment(),
        genMaintenanceTime([
          [20, 30, 20, 40],
          [0, 10, 1, 10],
        ])
      )
    ).toBeTruthy();
    expect(
      checkTimeInWithMaintenanceTime(
        moment(),
        genMaintenanceTime([[20, 30, 21, 40]])
      )
    ).toBeTruthy();

    expect(
      checkTimeInWithMaintenanceTime(
        moment(),
        genMaintenanceTime([[19, 30, 20, 40]])
      )
    ).toBeTruthy();

    expect(
      checkTimeInWithMaintenanceTime(
        moment(),
        genMaintenanceTime([[19, 0, 21, 0]])
      )
    ).toBeTruthy();

    expect(
      checkTimeInWithMaintenanceTime(
        moment(),
        genMaintenanceTime([[0, 0, 3, 0]])
      )
    ).toBeFalsy();

    global.Date.now = realDateNow;
  });
});
