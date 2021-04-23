import { useTheme } from '@material-ui/styles';
import { Button, Col, PageHeader, Row, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  getWorkflowListV1FilterCurrentStepTypeEnum,
  getWorkflowListV1FilterStatusEnum,
} from '../../api/workflow/index.enum';
import { IReduxState } from '../../store';
import { Theme } from '../../types/theme.type';
import MyOrder from './MyOrder';
import OrderList from './OrderList';
import QuickLink from './QuickLink';

const Home = () => {
  const theme = useTheme<Theme>();
  const { t } = useTranslation();

  const username = useSelector<IReduxState, string>(
    (state) => state.user.username
  );

  return (
    <>
      <PageHeader title={t('dashboard.pageTitle')} ghost={false}>
        Hi, {username}
        <div>
          <Typography.Text type="secondary">
            {t('dashboard.pageTips.before')}
            <Link to="/order"> {t('menu.order')} </Link>
            {t('dashboard.pageTips.after')}
          </Typography.Text>
        </div>
      </PageHeader>
      <section className="padding-content sqle-home-content">
        <Row gutter={theme.common.padding}>
          <Col span={16}>
            <Space
              size={theme.common.padding}
              className="full-width-element"
              direction="vertical"
            >
              <OrderList
                cardProps={{
                  title: t('dashboard.title.needMeReview'),
                  extra: [
                    <Link
                      to={{
                        pathname: `/order`,
                        search: `?currentStepAssignee=${username}&currentStepType=${getWorkflowListV1FilterCurrentStepTypeEnum.sql_review}&status=${getWorkflowListV1FilterStatusEnum.on_process}`,
                      }}
                      key="all"
                    >
                      <Button type="link">{t('common.showAll')}</Button>
                    </Link>,
                  ],
                }}
                requestParams={{
                  filter_current_step_assignee_user_name: username,
                  filter_current_step_type:
                    getWorkflowListV1FilterCurrentStepTypeEnum.sql_review,
                  filter_status: getWorkflowListV1FilterStatusEnum.on_process,
                }}
              />
              <OrderList
                cardProps={{
                  title: t('dashboard.title.needMeExec'),
                  extra: [
                    <Link
                      to={{
                        pathname: '/order',
                        search: `?currentStepAssignee=${username}&currentStepType=${getWorkflowListV1FilterCurrentStepTypeEnum.sql_execute}&status=${getWorkflowListV1FilterStatusEnum.on_process}`,
                      }}
                      key="all"
                    >
                      <Button type="link">{t('common.showAll')}</Button>
                    </Link>,
                  ],
                }}
                requestParams={{
                  filter_current_step_assignee_user_name: username,
                  filter_current_step_type:
                    getWorkflowListV1FilterCurrentStepTypeEnum.sql_execute,
                  filter_status: getWorkflowListV1FilterStatusEnum.on_process,
                }}
              />
            </Space>
          </Col>
          <Col span={8}>
            <Space
              direction="vertical"
              className="full-width-element"
              size={theme.common.padding}
            >
              <MyOrder />
              <QuickLink />
            </Space>
          </Col>
        </Row>
      </section>
    </>
  );
};

export default Home;
