import { useRequest } from 'ahooks';
import { Card, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import CustomTitle from './CustomTitle';
import GlobalService from '../../../api/global';
import { SQLE_DEFAULT_WEB_TITLE } from '../../../data/common';
import UploadLogo from './UploadLogo';
import { useDispatch } from 'react-redux';
import { updateWebTitleAndLog } from '../../../store/system';

const PersonalizeSetting: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const {
    data: sqleInfo,
    loading,
    refresh,
  } = useRequest(() =>
    GlobalService.getSQLEInfoV1().then((res) => {
      const webTitle = res.data.data?.title ?? SQLE_DEFAULT_WEB_TITLE;
      document.title = webTitle;
      dispatch(
        updateWebTitleAndLog({
          webTitle,
          webLogoUrl: res.data.data?.logo_url,
        })
      );
      return res.data.data;
    })
  );

  return (
    <Card loading={loading} title={t('system.title.personalize')}>
      <Space direction="vertical" className="full-width-element">
        <CustomTitle
          title={sqleInfo?.title ?? SQLE_DEFAULT_WEB_TITLE}
          refresh={refresh}
        />

        <UploadLogo url={sqleInfo?.logo_url} refresh={refresh} />
      </Space>
    </Card>
  );
};

export default PersonalizeSetting;
