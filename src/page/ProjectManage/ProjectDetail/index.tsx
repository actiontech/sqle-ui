import { useParams } from 'react-router-dom';
import ProjectDetail from './ProjectDetail';
import LocalStorageWrapper from '../../../utils/LocalStorageWrapper';
import StorageKey from '../../../data/StorageKey';
import { useEffect, useMemo, useState } from 'react';
import { cloneDeep, remove } from 'lodash';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import useCurrentUser from '../../../hooks/useCurrentUser';

export const DEFAULT_PROJECT_NAME = 'default';
export const DEFAULT_MAX_SHOW_PROJECT_NUMBER = 3;

export type ProjectDetailUrlParamType = {
  projectName: string;
};

export const useCurrentProjectName = () => {
  const { projectName = DEFAULT_PROJECT_NAME } =
    useParams<ProjectDetailUrlParamType>();
  return { projectName };
};

export const useRecentlyOpenedProjects = () => {
  const { bindProjects, username } = useCurrentUser();
  const [recentlyProjectsRecord, setRecentlyProjectsRecord] = useState<
    Record<string, string[]>
  >(() => {
    const data = LocalStorageWrapper.get(StorageKey.Project_Catch);
    try {
      return JSON.parse(data || '{}');
    } catch (error) {
      return [];
    }
  });

  const recentlyProjects = useMemo(() => {
    const localData = recentlyProjectsRecord[username] ?? [];
    return localData.filter((name) =>
      bindProjects.some((project) => project.project_name === name)
    );
  }, [bindProjects, recentlyProjectsRecord, username]);

  const updateRecentlyProject = (projectName: string) => {
    const temp = cloneDeep(recentlyProjectsRecord[username] ?? []);

    if (temp.includes(projectName)) {
      remove(temp, (v) => v === projectName);
    }

    temp.unshift(projectName);

    if (temp.length > DEFAULT_MAX_SHOW_PROJECT_NUMBER) {
      temp.pop();
    }

    const realRecord = {
      ...recentlyProjectsRecord,
      [username]: temp,
    };

    EventEmitter.emit(EmitterKey.Update_Recently_Opened_Projects, realRecord);
    LocalStorageWrapper.set(
      StorageKey.Project_Catch,
      JSON.stringify(realRecord)
    );
  };

  useEffect(() => {
    const updateRecentlyProject = (value: Record<string, string[]>) => {
      setRecentlyProjectsRecord(value);
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
