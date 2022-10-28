import { AxiosResponse } from 'axios';
import { successData } from '../../../../testUtils/mockRequest';

const serverVersion = `"issue_201 b1c2baedcb37f27feb7cef34f088212938fad1ba"`;
const formatServerVersion = `Server Version: issue_201 b1c2baedcb`;

const resolveThreeSecond = (
  data: any,
  { status = 200, headers = {}, config = {}, statusText = '' } = {}
) => {
  return new Promise<AxiosResponse<any>>((res) => {
    setTimeout(() => {
      res({
        status,
        headers,
        config,
        statusText,
        ...successData(data),
      });
    }, 3000);
  });
};

export const modalTestData = {
  serverVersion,
  formatServerVersion,
  resolveThreeSecond,
};
