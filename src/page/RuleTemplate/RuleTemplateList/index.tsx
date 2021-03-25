import { SyncOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import {
  Button,
  Card,
  Col,
  Divider,
  List,
  message,
  Popconfirm,
  Space,
  Typography,
} from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ruleTemplate from '../../../api/rule_template';
import EmptyBox from '../../../components/EmptyBox';
import { ResponseCode } from '../../../data/common';

const RuleTemplateList = () => {
  const { t } = useTranslation();

  const {
    data,
    loading,
    refresh: refreshRuleTemplate,
    pagination: { total, onChange: changePagination, changeCurrent },
  } = useRequest(
    ({ current, pageSize }) =>
      ruleTemplate.getRuleTemplateListV1({
        page_index: current,
        page_size: pageSize,
      }),
    {
      paginated: true,
      formatResult(res) {
        return {
          list: res.data?.data ?? [],
          total: res.data?.total_nums ?? 0,
        };
      },
    }
  );

  const pageChange = React.useCallback(
    (current: number, pageSize?: number) => {
      if (pageSize) {
        changePagination(current, pageSize);
      } else {
        changeCurrent(current);
      }
    },
    [changeCurrent, changePagination]
  );

  const deleteTemplate = React.useCallback(
    (templateName: string) => {
      const hideLoading = message.loading(
        t('ruleTemplate.deleteRuleTemplate.deleting', { name: templateName }),
        0
      );
      ruleTemplate
        .deleteRuleTemplateV1({
          rule_template_name: templateName,
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            message.success(
              t('ruleTemplate.deleteRuleTemplate.deleteSuccessTips', {
                name: templateName,
              })
            );
            refreshRuleTemplate();
          }
        })
        .finally(() => {
          hideLoading();
        });
    },
    [refreshRuleTemplate, t]
  );

  return (
    <>
      <Card
        title={t('ruleTemplate.ruleTemplateListTitle')}
        extra={[
          <Space key="button-wrapper">
            <Button onClick={refreshRuleTemplate}>
              <SyncOutlined spin={loading} />
            </Button>
            <Link to="/rule/template/create">
              <Button type="primary">
                {t('ruleTemplate.createRuleTemplate.button')}
              </Button>
            </Link>
          </Space>,
        ]}
      >
        <List
          loading={loading}
          dataSource={data?.list}
          pagination={{
            total,
            defaultPageSize: 10,
            showSizeChanger: true,
            onChange: pageChange,
          }}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.rule_template_name}
                description={
                  item.desc || t('ruleTemplate.ruleTemplateList.descEmpty')
                }
              />
              <Col flex={1}>
                <div>{t('ruleTemplate.ruleTemplateList.instance')}</div>
                <EmptyBox
                  if={
                    !!item.instance_name_list &&
                    item.instance_name_list.length > 0
                  }
                  defaultNode={
                    <Typography.Text disabled>
                      {t('ruleTemplate.ruleTemplateList.instanceEmpty')}
                    </Typography.Text>
                  }
                >
                  {item.instance_name_list?.join(',')}
                </EmptyBox>
              </Col>
              <Col flex="0 0 200px">
                <Space className="user-cell flex-end-horizontal">
                  <Link to={`/rule/template/update/${item.rule_template_name}`}>
                    {t('common.edit')}
                  </Link>
                  <Divider type="vertical" />
                  <Popconfirm
                    title={t('ruleTemplate.deleteRuleTemplate.tips', {
                      name: item.rule_template_name,
                    })}
                    placement="topRight"
                    onConfirm={deleteTemplate.bind(
                      null,
                      item.rule_template_name ?? ''
                    )}
                  >
                    <Typography.Text type="danger" className="pointer">
                      {t('common.delete')}
                    </Typography.Text>
                  </Popconfirm>
                </Space>
              </Col>
            </List.Item>
          )}
        />
      </Card>
    </>
  );
};

export default RuleTemplateList;
