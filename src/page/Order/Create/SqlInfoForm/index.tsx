import { useBoolean } from 'ahooks';
import { Button, Form, Switch, SwitchProps } from 'antd';
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
import EmptyBox from '../../../../components/EmptyBox';
import TestDatabaseConnectButton from '../../../../components/TestDatabaseConnectButton';
import { ResponseCode, PageFormLayout } from '../../../../data/common';
import EmitterKey from '../../../../data/EmitterKey';
import EventEmitter from '../../../../utils/EventEmitter';
import {
  SqlStatementForm,
  SqlStatementFormTabs,
  SqlStatementFormTabsRefType,
} from '../../SqlStatementFormTabs';
import DatabaseInfo from './DatabaseInfo';
import { InstanceNamesType, SqlInfoFormProps } from './index.type';

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

  const [connectAble, { toggle: setConnectAble }] = useBoolean();
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
    const params = {
      instances: instanceNameList.map((v) => ({ name: v ?? '' })),
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
          currentSqlMode={currentSqlMode}
          setChangeSqlModeDisabled={setChangeSqlModeDisabledAndSetValue}
          clearTaskInfoWithKey={props.clearTaskInfoWithKey}
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

        {/* IFTRUE_isEE */}
        <Form.Item
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
        {/* FITRUE_isEE */}

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
          <SqlStatementForm
            form={props.form}
            isClearFormWhenChangeSqlType={true}
          />
        </EmptyBox>

        <Form.Item label=" " colon={false}>
          <Button onClick={submit} type="primary" loading={submitLoading}>
            {t('order.sqlInfo.audit')}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default SqlInfoForm;
