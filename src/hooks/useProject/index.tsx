import React from 'react';
import { useBoolean } from 'ahooks';
import { IProjectTipResV1 } from '../../api/common';
import { ResponseCode } from '../../data/common';
import { Select } from 'antd';
import project from '../../api/project';
import { IGetProjectTipsV1Params } from '../../api/project/index.d';

const useProject = () => {
  const [projectList, setProjectList] = React.useState<IProjectTipResV1[]>([]);
  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateProjectList = React.useCallback(
    (params?: IGetProjectTipsV1Params) => {
      setTrue();
      project
        .getProjectTipsV1(params ?? {})
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            setProjectList(res.data?.data ?? []);
          } else {
            setProjectList([]);
          }
        })
        .catch(() => {
          setProjectList([]);
        })
        .finally(() => {
          setFalse();
        });
    },
    [setFalse, setTrue]
  );

  const generateProjectSelectOption = React.useCallback(() => {
    return projectList.map((project) => {
      return (
        <Select.Option
          key={project.project_name}
          value={project.project_name ?? ''}
        >
          {project.project_name}
        </Select.Option>
      );
    });
  }, [projectList]);

  return {
    projectList,
    loading,
    updateProjectList,
    generateProjectSelectOption,
  };
};

export default useProject;
