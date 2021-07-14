import { useBoolean } from 'ahooks';
import { Select } from 'antd';
import React from 'react';
import { IWorkflowTemplateTipResV1 } from '../../api/common';
import workflow from '../../api/workflow';
import { ResponseCode } from '../../data/common';

const useWorkflowTemplate = () => {
  const [workflowTemplate, setWorkflowTemplate] = React.useState<
    IWorkflowTemplateTipResV1[]
  >([]);
  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateWorkflowTemplate = React.useCallback(() => {
    setTrue();
    workflow
      .getWorkflowTemplateTipsV1()
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setWorkflowTemplate(res.data?.data ?? []);
        } else {
          setWorkflowTemplate([]);
        }
      })
      .catch(() => {
        setWorkflowTemplate([]);
      })
      .finally(() => {
        setFalse();
      });
  }, [setFalse, setTrue]);

  const generateWorkflowSelectOptions = React.useCallback(() => {
    return workflowTemplate.map((workflow) => {
      return (
        <Select.Option
          key={workflow.workflow_template_name}
          value={workflow.workflow_template_name ?? ''}
        >
          {workflow.workflow_template_name}
        </Select.Option>
      );
    });
  }, [workflowTemplate]);

  return {
    workflowTemplate,
    loading,
    updateWorkflowTemplate,
    generateWorkflowSelectOptions,
  };
};

export default useWorkflowTemplate;
