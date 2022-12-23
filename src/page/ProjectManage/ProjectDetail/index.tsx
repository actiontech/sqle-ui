import { LinkProps, useParams } from 'react-router-dom';
import ProjectDetail from './ProjectDetail';
import { Pathname, Search } from 'history';
import LocalStorageWrapper from '../../../utils/LocalStorageWrapper';
import StorageKey from '../../../data/StorageKey';
import { useEffect, useState } from 'react';
import { cloneDeep, remove } from 'lodash';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';

export const DEFAULT_PROJECT_NAME = 'default';
export const DEFAULT_MAX_SHOW_PROJECT_NUMBER = 3;

export type CustomLinkProps = Omit<LinkProps, 'to'> & {
  to: Pathname;
  search?: Search;
} & ProjectDetailUrlParamType;

export type ProjectDetailUrlParamType = {
  projectName: string;
};

export const useCurrentProjectName = () => {
  const { projectName = DEFAULT_PROJECT_NAME } =
    useParams<ProjectDetailUrlParamType>();
  return { projectName };
};

export const useRecentlyOpenedProjects = () => {
  const [recentlyProjects, setRecentlyProjects] = useState<string[]>(() => {
    const data = LocalStorageWrapper.get(StorageKey.Project_Catch);
    try {
      return JSON.parse(data || '[]');
    } catch (error) {
      return [];
    }
  });

  const updateRecentlyProject = (projectName: string) => {
    const temp = cloneDeep(recentlyProjects);

    if (temp.includes(projectName)) {
      remove(temp, (v) => v === projectName);
    }

    temp.unshift(projectName);

    if (temp.length > DEFAULT_MAX_SHOW_PROJECT_NUMBER) {
      temp.pop();
    }

    EventEmitter.emit(EmitterKey.Update_Recently_Opened_Projects, temp);
    LocalStorageWrapper.set(StorageKey.Project_Catch, JSON.stringify(temp));
  };

  useEffect(() => {
    const updateRecentlyProject = (projectNames: string[]) => {
      setRecentlyProjects(projectNames);
    };
    EventEmitter.subscribe(
      EmitterKey.Update_Recently_Opened_Projects,
      updateRecentlyProject
    );
    return () => {
      EventEmitter.unsubscribe(
        EmitterKey.Update_Recently_Opened_Projects,
        updateRecentlyProject
      );
    };
  }, []);

  return {
    recentlyProjects,
    updateRecentlyProject,
  };
};

export default ProjectDetail;
