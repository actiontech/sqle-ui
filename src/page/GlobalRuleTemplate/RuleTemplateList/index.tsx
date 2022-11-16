import { SyncOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Card, message, Space, Table } from 'antd';
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
import useCurrentUser from '../../../hooks/useCurrentUser';
import {
  initGlobalRuleTemplateListModalStatus,
  updateGlobalSelectRuleTemplate,
  updateGlobalRuleTemplateListModalStatus,
} from '../../../store/globalRuleTemplate';
import EventEmitter from '../../../utils/EventEmitter';
import { RuleTemplateListTableColumnFactory } from './column';
import RuleTemplateListModal from './Modal';

const RuleTemplateList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isAdmin } = useCurrentUser();

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
      updateGlobalSelectRuleTemplate({
        ruleTemplate,
      })
    );
    dispatch(
      updateGlobalRuleTemplateListModalStatus({
        modalName: ModalName.Clone_Rule_Template,
        status: true,
      })
    );
  };

  useEffect(() => {
    dispatch(
      initGlobalRuleTemplateListModalStatus({
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
    EventEmitter.subscribe(
      EmitterKey.Refresh_Global_Rule_Template_List,
      scopeRefresh
    );
    return () => {
      EventEmitter.unsubscribe(
        EmitterKey.Refresh_Global_Rule_Template_List,
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
            <EmptyBox if={isAdmin}>
              <Button type="primary">
                {t('ruleTemplate.createRuleTemplate.button')}
              </Button>
            </EmptyBox>
          </Link>,
        ]}
      >
        <Table
          rowKey="rule_template_name"
          loading={loading}
          dataSource={data?.list}
          pagination={{
            total,
            defaultPageSize: 10,
            showSizeChanger: true,
            onChange: pageChange,
          }}
          columns={RuleTemplateListTableColumnFactory(
            deleteTemplate,
            openCloneRuleTemplateModal,
            isAdmin
          )}
        />
      </Card>
      <RuleTemplateListModal />
    </>
  );
};

export default RuleTemplateList;
