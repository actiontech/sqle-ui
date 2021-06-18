import moment from 'moment';
import {
  emailValidate,
  formatTime,
  getFileFromUploadChangeEvent,
  translateTimeForRequest,
} from '../Common';

describe('utils/Common', () => {
  test('should check params is a email address', () => {
    expect(emailValidate('aaaa@bbb.com')).toBe(true);
    expect(emailValidate('a.a.a.a@bbb.com')).toBe(true);
    expect(emailValidate('aaaa@b.b.b.com')).toBe(true);
    expect(emailValidate('a+_.a-aa@bbb.com')).toBe(true);
    expect(emailValidate('" asdcxv xac v我的 aasdaa "@bbb.com')).toBe(true);

    expect(emailValidate('a aaa@bbb.com')).toBe(false);
    expect(emailValidate('<aaaa@bbb.com')).toBe(false);
    expect(emailValidate('aaaa@bbb.c')).toBe(false);
    expect(emailValidate('aaaa@b<b.c')).toBe(false);
  });

  test('should format moment to YYYY-MM-DD HH:mm:ss', () => {
    expect(formatTime('2021-06-09T08:11:52Z')).toBe('2021-06-09 16:11:52');
    expect(formatTime('2021-06-09T08:11:52Z', '--')).toBe(
      '2021-06-09 16:11:52'
    );
    expect(formatTime(undefined, '--')).toBe('--');
  });

  test('should format a time from moment to YYYY-MM-DDTHH:mm:ssZ', () => {
    expect(translateTimeForRequest(moment('2021-06-09 08:11:52'))).toBe(
      `2021-06-09T08:11:52+08:00`
    );
    expect(translateTimeForRequest(undefined)).toBe(undefined);
  });

  test('should return file list from event', () => {
    expect(
      getFileFromUploadChangeEvent({
        file: {
          status: 'add',
          file: '111',
        },
      })
    ).toEqual([
      {
        status: 'add',
        file: '111',
      },
    ]);

    expect(
      getFileFromUploadChangeEvent({
        file: {
          status: 'removed',
          file: '111',
        },
      })
    ).toEqual([]);
    expect(
      getFileFromUploadChangeEvent({
        file2: {
          status: 'add',
          file: '111',
        },
      })
    ).toEqual([]);
  });
});
