import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Row, Select } from 'antd';
import { cloneDeep } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WorkflowResV2ModeEnum } from '../../../../api/common.enum';
import instance from '../../../../api/instance';
import EmptyBox from '../../../../components/EmptyBox';
import { ResponseCode } from '../../../../data/common';
import EmitterKey from '../../../../data/EmitterKey';
import useInstance from '../../../../hooks/useInstance';
import EventEmitter from '../../../../utils/EventEmitter';
import { useCurrentProjectName } from '../../../ProjectManage/ProjectDetail';
import { DatabaseInfoProps, SchemaListType } from './index.type';

const DatabaseInfo: React.FC<DatabaseInfoProps> = ({
  form,
  instanceNameChange,
  setInstanceNames,
  currentSqlMode,
  setChangeSqlModeDisabled,
  clearTaskInfoWithKey,
}) => {
  const { t } = useTranslation();

  const { projectName } = useCurrentProjectName();
  const [schemaList, setSchemaList] = useState<SchemaListType>(
    new Map([[0, []]])
  );

  const instanceTypeMap = useRef<Map<number, string>>(new Map());
  const { updateInstanceList, generateInstanceSelectOption, instanceList } =
    useInstance();

  const handleInstanceNameChange = (name: string, index: number) => {
    setInstanceNames((values) => {
      const cloneValue = cloneDeep(values);
      cloneValue.set(index, name);
      return cloneValue;
    });
    instanceNameChange?.(name);
    updateSchemaList(name, index);
    const currentInstance = instanceList.find((v) => v.instance_name === name);

    if (currentInstance && index === 0) {
      updateInstanceList({
        filter_workflow_template_id:
          currentInstance.workflow_template_id?.toString(),
        filter_db_type:
          currentSqlMode === WorkflowResV2ModeEnum.same_sqls
            ? currentInstance?.instance_type
            : undefined,
        project_name: projectName,
      });
    }
    getInstanceTypeWithAction(index, 'add', currentInstance?.instance_type);
  };

  const updateSchemaList = (name: string, index: number) => {
    instance
      .getInstanceSchemasV1({
        instance_name: name,
        project_name: projectName,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setSchemaList((values) => {
            const cloneValue = cloneDeep(values);
            cloneValue.set(index, res.data.data?.schema_name_list ?? []);
            return cloneValue;
          });
        }
      });
  };

  const generateInstanceSchemaSelectOption = (index: number) => {
    return (
      schemaList.get(index)?.map((schema) => (
        <Select.Option value={schema} key={schema}>
          {schema}
        </Select.Option>
      )) ?? []
    );
  };

  const getInstanceTypeWithAction = (
    key: number,
    type: 'add' | 'remove',
    instanceType = ''
  ) => {
    if (type === 'add') {
      instanceTypeMap.current.set(key, instanceType);
    } else if (type === 'remove') {
      instanceTypeMap.current.delete(key);
    }
    const instanceTypeSet = new Set(instanceTypeMap.current.values());
    const isExistDifferentInstanceType = instanceTypeSet.size > 1;
    setChangeSqlModeDisabled(isExistDifferentInstanceType);
  };

  useEffect(() => {
    EventEmitter.subscribe(
      EmitterKey.Reset_Create_Order_Form,
      updateInstanceList
    );
    return () => {
      EventEmitter.unsubscribe(
        EmitterKey.Reset_Create_Order_Form,
        updateInstanceList
      );
    };
  }, [updateInstanceList]);

  useEffect(() => {
    updateInstanceList({ project_name: projectName });
  }, [currentSqlMode, projectName, updateInstanceList]);

  return (
    <Form.List name="dataBaseInfo" initialValue={[{}]}>
      {(fields, { add, remove }) => (
        <>
          {fields.map((field, index) => (
            <Row key={field.key}>
              <Col span={12}>
                <Form.Item
                  labelCol={{
                    xs: { span: 24 },
                    sm: { span: 16 },
                  }}
                  wrapperCol={{
                    xs: { span: 24 },
                    sm: { span: 8 },
                  }}
                  tooltip={
                    index === 0
                      ? t('order.sqlInfo.instanceNameTips')
                      : undefined
                  }
                  label={t('order.sqlInfo.instanceName')}
                  {...field}
                  name={[field.name, 'instanceName']}
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Select<string>
                    onChange={(value) =>
                      handleInstanceNameChange(value, field.key)
                    }
                    showSearch
                    placeholder={t('common.form.placeholder.select', {
                      name: t('order.sqlInfo.instanceName'),
                    })}
                  >
                    {generateInstanceSelectOption()}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Row gutter={8}>
                  <Col span={22}>
                    <Form.Item
                      noStyle
                      shouldUpdate={(prevValues, curValues) => {
                        return (
                          prevValues?.dataBaseInfo[index]?.instanceName !==
                          curValues?.dataBaseInfo[index]?.instanceName
                        );
                      }}
                    >
                      {() => (
                        <Form.Item
                          labelCol={{
                            xs: { span: 24 },
                            sm: { span: 8 },
                          }}
                          wrapperCol={{
                            xs: { span: 24 },
                            sm: { span: 24 },
                            md: { span: 24 },
                          }}
                          {...field}
                          name={[field.name, 'instanceSchema']}
                          label={t('order.sqlInfo.instanceSchema')}
                        >
                          <Select
                            disabled={
                              !form.getFieldValue('dataBaseInfo')[index]
                                ?.instanceName
                            }
                            placeholder={t('common.form.placeholder.select')}
                            showSearch
                            allowClear
                          >
                            {generateInstanceSchemaSelectOption(index)}
                          </Select>
                        </Form.Item>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={2}>
                    <EmptyBox if={index !== 0}>
                      <MinusCircleOutlined
                        style={{ marginTop: 8 }}
                        onClick={() => {
                          setInstanceNames((values) => {
                            const cloneValue = cloneDeep(values);
                            cloneValue.delete(field.key);
                            return cloneValue;
                          });
                          getInstanceTypeWithAction(field.key, 'remove');
                          remove(index);
                          clearTaskInfoWithKey(field.key.toString());
                        }}
                      />
                    </EmptyBox>
                  </Col>
                </Row>
              </Col>
            </Row>
          ))}
          {/* IFTRUE_isEE */}
          <Form.Item label=" " colon={false}>
            <Button
              type="dashed"
              onClick={() => {
                setInstanceNames((values) => {
                  const cloneValue = cloneDeep(values);
                  cloneValue.set(fields[fields.length - 1].key + 1, '');
                  return cloneValue;
                });
                add();
              }}
              block
              icon={<PlusOutlined />}
            >
              {t('order.sqlInfo.addInstance')}
            </Button>
          </Form.Item>
          {/* FITRUE_isEE */}
        </>
      )}
    </Form.List>
  );
};

export default DatabaseInfo;
