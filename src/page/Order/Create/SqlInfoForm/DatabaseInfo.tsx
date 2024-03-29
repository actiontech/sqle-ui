import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Row, Select } from 'antd';
import { cloneDeep } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import instance from '../../../../api/instance';
import { getInstanceTipListV1FunctionalModuleEnum } from '../../../../api/instance/index.enum';
import EmptyBox from '../../../../components/EmptyBox';
import { ResponseCode } from '../../../../data/common';
import useInstance from '../../../../hooks/useInstance';
import { RuleUrlParamKey } from '../../../Rule/useRuleFilterForm';
import {
  DatabaseInfoProps,
  RuleTemplateListType,
  SchemaListType,
} from './index.type';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';

const DatabaseInfo: React.FC<DatabaseInfoProps> = ({
  form,
  instanceNameChange,
  setInstanceNames,
  setChangeSqlModeDisabled,
  clearTaskInfoWithKey,
  projectName,
}) => {
  const { t } = useTranslation();

  const [schemaList, setSchemaList] = useState<SchemaListType>(
    new Map([[0, []]])
  );

  const [ruleTemplates, setRuleTemplates] = useState<RuleTemplateListType>(
    new Map([[0, undefined]])
  );

  const instanceTypeMap = useRef<Map<number, string>>(new Map());
  const { updateInstanceList, generateInstanceSelectOption, instanceList } =
    useInstance();

  const handleInstanceNameChange = (name: string, fieldKey: number) => {
    setInstanceNames((values) => {
      const cloneValue = cloneDeep(values);
      cloneValue.set(fieldKey, name);
      return cloneValue;
    });

    instanceNameChange?.(name);
    updateSchemaList(name, fieldKey);
    updateRuleTemplateName(name, fieldKey);
    const currentInstance = instanceList.find((v) => v.instance_name === name);

    getInstanceTypeWithAction(fieldKey, 'add', currentInstance?.instance_type);
  };

  const updateRuleTemplateName = (name: string, fieldKey: number) => {
    instance
      .getInstanceV2({ instance_name: name, project_name: projectName })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setRuleTemplates((values) => {
            const cloneValue = cloneDeep(values);
            cloneValue.set(fieldKey, res.data.data?.rule_template);
            return cloneValue;
          });
        }
      });
  };

  const updateSchemaList = (name: string, fieldKey: number) => {
    instance
      .getInstanceSchemasV1({
        instance_name: name,
        project_name: projectName,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setSchemaList((values) => {
            const cloneValue = cloneDeep(values);
            cloneValue.set(fieldKey, res.data.data?.schema_name_list ?? []);
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

  const ruleTemplateDisplay = useCallback(
    (fieldKey: number) => {
      const rule = ruleTemplates.get(fieldKey);
      if (!rule) {
        return undefined;
      }

      if (rule.is_global_rule_template) {
        return (
          <Link to={`/rule?${RuleUrlParamKey.ruleTemplateName}=${rule.name}`}>
            {t('rule.form.ruleTemplate')}: {rule.name}
          </Link>
        );
      }

      return (
        <Link
          to={`/rule?${RuleUrlParamKey.ruleTemplateName}=${rule.name}&${RuleUrlParamKey.projectName}=${projectName}`}
        >
          {t('rule.form.ruleTemplate')}: {rule.name}
        </Link>
      );
    },
    [projectName, ruleTemplates, t]
  );

  useEffect(() => {
    updateInstanceList({
      project_name: projectName,
      functional_module:
        getInstanceTipListV1FunctionalModuleEnum.create_workflow,
    });
  }, [projectName, updateInstanceList]);

  useEffect(() => {
    const resetState = () => {
      setRuleTemplates(new Map([[0, undefined]]));
      setSchemaList(new Map([[0, []]]));
    };
    EventEmitter.subscribe(EmitterKey.Reset_Create_Order_Form, resetState);

    return () => {
      EventEmitter.unsubscribe(EmitterKey.Reset_Create_Order_Form, resetState);
    };
  }, []);

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
                    showSearch={true}
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
                        data-testid="remove-item"
                        onClick={() => {
                          setInstanceNames((values) => {
                            const cloneValue = cloneDeep(values);
                            cloneValue.delete(field.key);
                            return cloneValue;
                          });
                          getInstanceTypeWithAction(field.key, 'remove');
                          remove(index);
                          clearTaskInfoWithKey(field.key.toString());
                          setSchemaList((values) => {
                            const cloneValue = cloneDeep(values);
                            cloneValue.delete(field.key);
                            return cloneValue;
                          });
                          setRuleTemplates((values) => {
                            const cloneValue = cloneDeep(values);
                            cloneValue.delete(field.key);
                            return cloneValue;
                          });
                        }}
                      />
                    </EmptyBox>
                  </Col>
                </Row>
              </Col>

              <Col span={4} style={{ marginTop: 4 }}>
                {ruleTemplateDisplay(field.key)}
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
