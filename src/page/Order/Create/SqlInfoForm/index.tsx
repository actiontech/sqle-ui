import { useBoolean } from 'ahooks';
import { Form, Radio, RadioChangeEvent } from 'antd';
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
import DatabaseInfo from './DatabaseInfo';
import DifferenceSqlMode from './DifferenceSqlMode';
import {
  InstanceNamesType,
  SqlContentFields,
  SqlInfoFormProps,
} from './index.type';
import SameSqlMode from './SameSqlMode';

const SqlInfoForm: React.FC<SqlInfoFormProps> = (props) => {
  const { t } = useTranslation();
  const alreadySubmit = useRef(false);

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
            requestResult.map((v) => v.connect_error_message ?? '')
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

  const currentOrderModeChange = (event: RadioChangeEvent) => {
    setCurrentSqlMode(event.target.value);
  };

  const submit = useCallback(
    async (values: SqlContentFields, currentTabIndex: number) => {
      startSubmit();
      try {
        const params = await props.form.validateFields();
        props
          .submit({ ...params, ...values }, currentTabIndex)
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
    },
    [props, startSubmit, submitFinish]
  );

  const formValueChange = useCallback(() => {
    if (alreadySubmit.current) {
      props.updateDirtyData(true);
    }
  }, [alreadySubmit, props]);

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
        {/* IFTRUE_isEE */}
        <Form.Item
          name="orderMode"
          label={t('order.sqlInfo.orderMode')}
          rules={[
            {
              required: true,
            },
          ]}
          tooltip={t('order.sqlInfo.orderModeTips')}
          initialValue={WorkflowResV2ModeEnum.same_sqls}
        >
          <Radio.Group
            onChange={currentOrderModeChange}
            disabled={changeSqlModeDisabled}
          >
            <Radio value={WorkflowResV2ModeEnum.same_sqls}>
              {t('order.sqlInfo.sameSql')}
            </Radio>
            <Radio value={WorkflowResV2ModeEnum.different_sqls}>
              {t('order.sqlInfo.differenceSql')}
            </Radio>
          </Radio.Group>
        </Form.Item>
        {/* FITRUE_isEE */}

        <DatabaseInfo
          form={props.form}
          instanceNameChange={props.instanceNameChange}
          setInstanceNames={setInstanceNames}
          currentSqlMode={currentSqlMode}
          setChangeSqlModeDisabled={setChangeSqlModeDisabled}
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

        <EmptyBox
          if={WorkflowResV2ModeEnum.same_sqls === currentSqlMode}
          defaultNode={
            <DifferenceSqlMode
              submit={submit}
              instanceNameList={instanceNameList}
              submitLoading={submitLoading}
            />
          }
        >
          <SameSqlMode
            submit={submit}
            submitLoading={submitLoading}
            currentTabIndex={0}
          />
        </EmptyBox>
      </Form>
    </>
  );
};

export default SqlInfoForm;
