import { DownOutlined, SyncOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import {
  Button,
  Card,
  Col,
  Divider,
  Dropdown,
  List,
  Menu,
  message,
  Popconfirm,
  Space,
  Tag,
  Typography,
} from 'antd';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { IRuleTemplateResV1 } from '../../../api/common';
import ruleTemplate from '../../../api/rule_template';
import EmptyBox from '../../../components/EmptyBox';
import { ResponseCode } from '../../../data/common';
import EmitterKey from '../../../data/EmitterKey';
import { ModalName } from '../../../data/ModalName';
import {
  initRuleTemplateListModalStatus,
  updateRuleTemplateListModalStatus,
  updateSelectRuleTemplate,
} from '../../../store/ruleTemplate';
import EventEmitter from '../../../utils/EventEmitter';
import RuleTemplateListModal from './Modal';

const RuleTemplateList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

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

  const openCloneRuleTemplateModal = (ruleTemplate: IRuleTemplateResV1) => {
    dispatch(
      updateSelectRuleTemplate({
        ruleTemplate,
      })
    );
    dispatch(
      updateRuleTemplateListModalStatus({
        modalName: ModalName.Clone_Rule_Template,
        status: true,
      })
    );
  };

  useEffect(() => {
    dispatch(
      initRuleTemplateListModalStatus({
        modalStatus: {
          [ModalName.Clone_Rule_Template]: false,
        },
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const scopeRefresh = () => {
      refreshRuleTemplate();
    };
    EventEmitter.subscribe(EmitterKey.Refresh_Rule_Template_List, scopeRefresh);
    return () => {
      EventEmitter.unsubscribe(
        EmitterKey.Refresh_Rule_Template_List,
        scopeRefresh
      );
    };
  }, [refreshRuleTemplate]);

  return (
    <>
      <Card
        title={
          <Space>
            {t('ruleTemplate.ruleTemplateListTitle')}
            <Button onClick={refreshRuleTemplate}>
              <SyncOutlined spin={loading} />
            </Button>
          </Space>
        }
        extra={[
          <Link to="/rule/template/create" key="createRuleTemplate">
            <Button type="primary">
              {t('ruleTemplate.createRuleTemplate.button')}
            </Button>
          </Link>,
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
                style={{
                  flex: '0 0 200px',
                }}
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
                  {item.instance_name_list?.map((e) => (
                    <Tag key={e}>{e}</Tag>
                  ))}
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
                  <Divider type="vertical" />
                  <Dropdown
                    placement="bottomRight"
                    overlay={
                      <Menu>
                        <Menu.Item
                          key="update-user-password"
                          onClick={openCloneRuleTemplateModal.bind(null, item)}
                        >
                          {t('ruleTemplate.cloneRuleTemplate.button')}
                        </Menu.Item>
                      </Menu>
                    }
                  >
                    <Typography.Link className="pointer">
                      {t('common.more')}
                      <DownOutlined />
                    </Typography.Link>
                  </Dropdown>
                </Space>
              </Col>
            </List.Item>
          )}
        />
      </Card>
      <RuleTemplateListModal />
    </>
  );
};

export default RuleTemplateList;
