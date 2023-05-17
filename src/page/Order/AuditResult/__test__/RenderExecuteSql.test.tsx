import { render } from '@testing-library/react';
import RenderExecuteSql from '../RenderExecuteSql';

describe('test RenderExecuteSql', () => {
  test('should match snapshot', () => {
    const sql = `
  select count(*) from (SELECT DISTINCT t.con_no AS con_no    , CASE  WHEN tgua.atime IS NOT NULL THEN tgua.atime WHEN tcc.CTIME IS NOT NULL THEN tcc.CTIME WHEN bb.CTIME IS NOT NULL THEN bb.CTIME  END AS CTIME, t.PRO_METHOD AS pro_method FROM my_customer t LEFT OUTER JOIN first_ auth tgua ON t.con_no = tgua.con_no AND tgua.stat = 1 AND tgua.type = 'C' and (tgua.atime>= '2017-06-22' and tgua.atime< '2017-06-23') LEFT OUTER JOIN my_ contact tcc ON t.con_no = tcc.con_no AND tcc.NAME IS NOT NULL and (tcc.ctime>= '2017-06-22' and tcc.ctime< '2017-06-23') LEFT OUTER JOIN ( SELECT tcp.con_no AS con_no, tcai.CTIME AS CTIME FROM my_ person tcp INNER JOIN my_auth_info tcai ON tcp.CNO = tcai.CNO and (tcai.ctime>= '2017-06-22' and tcai.ctime< '2017-06-23') ) bb ON t.con_no = bb.con_no  WHERE t.PRO_METHOD = 'uc' and (tgua.con_no IS NOT NULL OR tcc.con_no IS NOT NULL OR bb.con_no IS NOT NULL)) pp order by pp.con_nosql2：select count(*) from  (SELECT DISTINCT t.con_no AS con_no , CASE                                WHEN tgua.atime IS NOT NULL THEN tgua.atime             WHEN tcc.CTIME IS NOT NULL THEN tcc.CTIME             WHEN bb.CTIME IS NOT NULL THEN bb.CTIME END AS CTIME, t.PRO_METHOD AS pro_method FROM my_customer t LEFT OUTER JOIN first_ auth tgua ON t.con_no = tgua.con_no AND tgua.status = 1 AND tgua.type = 'C' LEFT OUTER JOIN my_ contact tcc ON t.con_no = tcc.con_no AND tcc.NAME IS NOT NULL LEFT OUTER JOIN ( SELECT tcp.con_no AS con_no, tcai.CTIME AS CTIME FROM my_ person tcp INNER JOIN my_auth_info tcai ON tcp.CNO = tcai.CNO ) bb ON t.con_no = bb.con_no WHERE t.pro_method = 'uc' and (tgua.con_no IS NOT NULL OR tcc.con_no IS NOT NULL OR bb.con_no IS NOT NULL)) p where CTIME>= '2017-06-22' and CTIME< '2017-06-23' order by con_no `;

    const { container, rerender } = render(<RenderExecuteSql />);
    expect(container).toMatchSnapshot();

    rerender(<RenderExecuteSql sql={sql} />);
    expect(container).toMatchSnapshot();
  });
});
