import ApiBase from '../Api';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import store from '../../store';
import * as history from 'history';
import Download from '../Download';
import { notification } from 'antd';
import { updateToken } from '../../store/user';

const downloadSpy = jest.spyOn(Download, 'downloadByCreateElementA');
const notificationSpy = jest.spyOn(notification, 'error');
const server = setupServer();

describe('Api', () => {
  beforeAll(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
    downloadSpy.mockClear();
    notificationSpy.mockClear();
  });

  afterAll(() => {
    server.close();
    downloadSpy.mockRestore();
    notificationSpy.mockRestore();
  });

  test('should jump to login page when request return 401', async () => {
    server.use(
      rest.post('/test', (req, res, ctx) => {
        return res(
          ctx.status(401),
          ctx.json({
            code: 2,
            message: 'error',
          })
        );
      })
    );
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const createBrowserHistorySpy = jest.spyOn(history, 'createBrowserHistory');
    const historyPushSpy = jest.fn();
    createBrowserHistorySpy.mockReturnValue({
      push: historyPushSpy,
    } as any);
    let result;
    try {
      await ApiBase.post('/test');
    } catch (error) {
      result = error;
    } finally {
      expect(result?.response?.data).toEqual({
        code: 2,
        message: 'error',
      });
      expect(result?.response?.status).toBe(401);
      expect(dispatchSpy).toBeCalledTimes(2);
      expect(dispatchSpy).nthCalledWith(1, {
        payload: {
          role: '',
          username: '',
        },
        type: 'user/updateUser',
      });
      expect(dispatchSpy).nthCalledWith(2, {
        payload: {
          token: '',
        },
        type: 'user/updateToken',
      });
      dispatchSpy.mockRestore();
      expect(historyPushSpy).toBeCalledTimes(1);
      expect(historyPushSpy).toBeCalledWith('/login');
    }
  });

  test('should download file when request header includes content-disposition and attachment', async () => {
    server.use(
      rest.post('/test', (_, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.set(
            'content-disposition',
            'attachment; filename=exec_sql_db1_5.sql'
          ),
          ctx.body(new Blob(['use aaa']))
        );
      })
    );

    const result = await ApiBase.post('/test');
    expect(downloadSpy).toBeCalledTimes(1);
    expect(downloadSpy).toBeCalledWith(result.data, 'exec_sql_db1_5.sql');
  });

  test('should get truthy filename when request header includes content-disposition and attachment and filename includes *=', async () => {
    server.use(
      rest.post('/test', (_, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.set(
            'content-disposition',
            `attachment; filename*=utf-8'maybe have some code 'SQL%E5%AE%A1%E6%A0%B8%E6%8A%A5%E5%91%8A_db1_5.csv`
          ),
          ctx.body(new Blob(['use aaa']))
        );
      })
    );

    const result = await ApiBase.post('/test');
    expect(downloadSpy).toBeCalledTimes(1);
    expect(downloadSpy).toBeCalledWith(result.data, 'SQL审核报告_db1_5.csv');
  });

  test('should show error message when response status code is not equal 200', async () => {
    server.use(
      rest.post('/test', (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({
            code: 2,
            message: 'error message',
          })
        );
      })
    );
    let result;
    try {
      await ApiBase.post('/test');
    } catch (error) {
      result = error;
    } finally {
      expect(result?.response?.data).toEqual({
        code: 2,
        message: 'error message',
      });
      expect(result?.response?.status).toBe(500);
      expect(notificationSpy).toBeCalledTimes(1);
      expect(notificationSpy).toBeCalledWith({
        message: 'common.request.noticeFailTitle',
        description: 'error message',
      });
    }
  });

  test('should add token when request url is not equal "/login"', async () => {
    let token = '';
    server.use(
      rest.post('/test', (req, res, ctx) => {
        token = req.headers.get('Authorization') ?? '';
        return res(
          ctx.status(200),
          ctx.json({
            code: 1,
            message: 'error message',
          })
        );
      })
    );
    store.dispatch(updateToken({ token: 'token' }));
    try {
      await ApiBase.post('/test');
    } catch (error) {
    } finally {
      expect(token).toBe('token');
      expect(notificationSpy).toBeCalledTimes(1);
      expect(notificationSpy).toBeCalledWith({
        message: 'common.request.noticeFailTitle',
        description: 'error message',
      });
    }
  });

  test('should do not add token when request url is equal "/login"', async () => {
    let token = '';
    server.use(
      rest.post('/login', (req, res, ctx) => {
        token = req.headers.get('Authorization') ?? '';
        return res(
          ctx.status(200),
          ctx.json({
            code: 1,
            message: 'error message',
          })
        );
      })
    );
    store.dispatch(updateToken({ token: 'token' }));
    try {
      await ApiBase.post('/login');
    } catch (error) {
    } finally {
      expect(token).toBe('');
    }
  });
});
