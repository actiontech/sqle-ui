import { useBoolean } from 'ahooks';
import { Button, Form, Space, Switch, SwitchProps, Tooltip } from 'antd';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { WorkflowResV2ModeEnum } from '../../../../api/common.enum';
import instance from '../../../../api/instance';
import { IBatchCheckInstanceIsConnectableByNameParams } from '../../../../api/instance/index.d';
import EmptyBox from '../../../../components/EmptyBox';
import TestDatabaseConnectButton from '../../../../components/TestDatabaseConnectButton';
import { ResponseCode, PageFormLayout } from '../../../../data/common';
import EmitterKey from '../../../../data/EmitterKey';
import EventEmitter from '../../../../utils/EventEmitter';
import {
  SQLInputType,
  SqlStatementFields,
  SqlStatementForm,
  SqlStatementFormTabs,
  SqlStatementFormTabsRefType,
} from '../../SqlStatementFormTabs';
import DatabaseInfo from './DatabaseInfo';
import { InstanceNamesType, SqlInfoFormProps } from './index.type';
import {
  FormatLanguageSupport,
  formatterSQL,
} from '../../../../utils/FormatterSQL';
import { InfoCircleOutlined } from '@ant-design/icons';

const SqlInfoForm: React.FC<SqlInfoFormProps> = (props) => {
  const { t } = useTranslation();
  const alreadySubmit = useRef(false);
  const sqlStatementFormTabsRef = useRef<SqlStatementFormTabsRefType>(null);
  const [currentSqlMode, setCurrentSqlMode] = useState(
    WorkflowResV2ModeEnum.same_sqls
  );

  const [instanceNames, setInstanceNames] = useState<InstanceNamesType>(
    new Map([[0, '']])
  );
  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();

  const [connectAble, setConnectAble] = useState(false);
  const [
    connectInitHide,
    { setTrue: setConnectInitHideTrue, setFalse: setConnectInitHideFalse },
  ] = useBoolean(true);
  const [testLoading, { setTrue: testStart, setFalse: testFinish }] =
    useBoolean();
  const [connectErrorMessage, setConnectErrorMessage] = useState<string[]>([]);
  const [changeSqlModeDisabled, setChangeSqlModeDisabled] = useState(false);

  const instanceNameList = useMemo(() => {
    return Array.from(instanceNames).map(([_, name]) => name ?? '');
  }, [instanceNames]);

  const sqlStatementInfo = useMemo(() => {
    return Array.from(instanceNames)
      .filter(([_, name]) => !!name)
      .map(([key, name]) => {
        return {
          key: `${key}`,
          instanceName: name,
        };
      });
  }, [instanceNames]);

  const testConnectVisible = useMemo(() => {
    return instanceNameList.length > 0 && instanceNameList.every((v) => !!v);
  }, [instanceNameList]);

  const testDatabaseConnect = useCallback(async () => {
    testStart();
    const params: IBatchCheckInstanceIsConnectableByNameParams = {
      instances: instanceNameList.map((v) => ({ name: v ?? '' })),
      project_name: props.projectName,
    };
    instance
      .batchCheckInstanceIsConnectableByName(params)
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          const requestResult = res.data.data ?? [];
          setConnectAble(
            requestResult.length > 0 &&
              !!requestResult.every((v) => !!v?.is_instance_connectable)
          );

          setConnectErrorMessage(
            requestResult
              .filter((v) => !!v.connect_error_message)
              .map((v) => v.connect_error_message!)
          );
        }
      })
      .finally(() => {
        setConnectInitHideFalse();
        testFinish();
      });
  }, [
    instanceNameList,
    props.projectName,
    setConnectAble,
    setConnectInitHideFalse,
    testFinish,
    testStart,
  ]);

  const currentOrderModeChange: SwitchProps['onChange'] = (flag) => {
    props.clearTaskInfos();
    setCurrentSqlMode(
      flag
        ? WorkflowResV2ModeEnum.same_sqls
        : WorkflowResV2ModeEnum.different_sqls
    );
  };

  const submit = useCallback(async () => {
    startSubmit();
    try {
      const params = await props.form.validateFields();
      props
        .submit(
          params,
          sqlStatementFormTabsRef.current?.activeIndex ?? 0,
          sqlStatementFormTabsRef.current?.activeKey ?? ''
        )
        .then(() => {
          alreadySubmit.current = true;
          props.updateDirtyData(false);
        })
        .finally(() => {
          submitFinish();
        });
    } catch (error) {
      submitFinish();
    }
  }, [props, startSubmit, submitFinish]);

  const formValueChange = useCallback(() => {
    if (alreadySubmit.current) {
      props.updateDirtyData(true);
    }
  }, [alreadySubmit, props]);

  const setChangeSqlModeDisabledAndSetValue = useCallback(
    (disabled: boolean) => {
      setChangeSqlModeDisabled(disabled);
      if (disabled) {
        props.form.setFieldsValue({
          isSameSqlOrder: false,
        });
        setCurrentSqlMode(WorkflowResV2ModeEnum.different_sqls);
      }
    },
    [props.form]
  );

  const formatSql = async () => {
    const params = await props.form.getFieldsValue();
    const getInstanceType = (name: string) => {
      return instance
        .getInstanceV2({
          project_name: props.projectName,
          instance_name: name,
        })
        .then((res) => res.data.data);
    };
    if (currentSqlMode === WorkflowResV2ModeEnum.same_sqls) {
      const sqlStatementInfo = params['0'] as SqlStatementFields;
      const instanceName = params.dataBaseInfo[0].instanceName;
      if (sqlStatementInfo?.sqlInputType !== SQLInputType.manualInput) {
        return;
      }
      if (instanceName) {
        getInstanceType(instanceName).then((res) => {
          props.form.setFields([
            {
              name: ['0', 'sql'],
              value: formatterSQL(sqlStatementInfo.sql, res?.db_type),
            },
          ]);
        });
      } else {
        props.form.setFields([
          {
            name: ['0', 'sql'],
            value: formatterSQL(sqlStatementInfo.sql),
          },
        ]);
      }
    } else {
      const sqlStatementInfo = params[
        sqlStatementFormTabsRef.current?.activeKey ?? ''
      ] as SqlStatementFields;

      const instanceName = params.dataBaseInfo.filter((v) => v.instanceName)[
        sqlStatementFormTabsRef.current?.activeIndex ?? 0
      ].instanceName;
      if (sqlStatementInfo?.sqlInputType !== SQLInputType.manualInput) {
        return;
      }

      if (instanceName) {
        getInstanceType(instanceName).then((res) => {
          props.form.setFields([
            {
              name: [sqlStatementFormTabsRef.current?.activeKey ?? '', 'sql'],
              value: formatterSQL(sqlStatementInfo.sql, res?.db_type),
            },
          ]);
        });
      } else {
        props.form.setFields([
          {
            name: [sqlStatementFormTabsRef.current?.activeKey ?? '', 'sql'],
            value: formatterSQL(sqlStatementInfo.sql),
          },
        ]);
      }
    }
  };

  useEffect(() => {
    const resetAlreadySubmit = () => {
      alreadySubmit.current = false;
      setInstanceNames(new Map([[0, '']]));
      setConnectInitHideTrue();
      setCurrentSqlMode(WorkflowResV2ModeEnum.same_sqls);
    };
    EventEmitter.subscribe(
      EmitterKey.Reset_Create_Order_Form,
      resetAlreadySubmit
    );
    return () => {
      EventEmitter.unsubscribe(
        EmitterKey.Reset_Create_Order_Form,
        resetAlreadySubmit
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Form
        form={props.form}
        {...PageFormLayout}
        onValuesChange={formValueChange}
      >
        <DatabaseInfo
          form={props.form}
          instanceNameChange={props.instanceNameChange}
          setInstanceNames={setInstanceNames}
          setChangeSqlModeDisabled={setChangeSqlModeDisabledAndSetValue}
          clearTaskInfoWithKey={props.clearTaskInfoWithKey}
          projectName={props.projectName}
        />
        <Form.Item label=" " colon={false} hidden={!testConnectVisible}>
          <TestDatabaseConnectButton
            initHide={connectInitHide}
            onClickTestButton={testDatabaseConnect}
            loading={testLoading}
            connectAble={connectAble}
            connectDisableReason={connectErrorMessage.join('\n')}
          />
        </Form.Item>

        <Form.Item
          /* IFTRUE_isCE */
          hidden={true}
          /* FITRUE_isCE */
          name="isSameSqlOrder"
          label={t('order.sqlInfo.isSameSqlOrder')}
          rules={[
            {
              required: true,
            },
          ]}
          tooltip={t('order.sqlInfo.orderModeTips')}
          valuePropName="checked"
          initialValue={!changeSqlModeDisabled}
        >
          <Switch
            onChange={currentOrderModeChange}
            disabled={changeSqlModeDisabled}
          />
        </Form.Item>

        {/* IFTRUE_isEE */}
        <EmptyBox
          if={WorkflowResV2ModeEnum.same_sqls === currentSqlMode}
          defaultNode={
            <SqlStatementFormTabs
              ref={sqlStatementFormTabsRef}
              form={props.form}
              isClearFormWhenChangeSqlType={true}
              sqlStatementInfo={sqlStatementInfo}
            />
          }
        >
          {/* FITRUE_isEE */}

          <SqlStatementForm
            form={props.form}
            isClearFormWhenChangeSqlType={true}
          />

          {/* IFTRUE_isEE */}
        </EmptyBox>
        {/* FITRUE_isEE */}

        <Form.Item label=" " colon={false}>
          <Space size={16}>
            <Button onClick={submit} type="primary" loading={submitLoading}>
              {t('order.sqlInfo.audit')}
            </Button>
            <Space>
              <Button onClick={formatSql} loading={submitLoading}>
                {t('order.sqlInfo.format')}
              </Button>

              <Tooltip
                overlay={t('order.sqlInfo.formatTips', {
                  supportType: Object.keys(FormatLanguageSupport).join('、'),
                })}
              >
                <InfoCircleOutlined className="text-orange" />
              </Tooltip>
            </Space>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
};

export default SqlInfoForm;
