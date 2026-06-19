/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

interface ProjectMetricsContextType {
  canvasesCount: number;
  layersCount: number;
  activeExportsCount: number;
  setCanvasesCount: (count: number) => void;
  setLayersCount: (count: number) => void;
  setActiveExportsCount: (count: number) => void;
  incrementActiveExports: () => void;
  decrementActiveExports: () => void;
}

const ProjectMetricsContext = createContext<ProjectMetricsContextType | undefined>(undefined);

export function ProjectMetricsProvider({ children }: { children: React.ReactNode }) {
  const [canvasesCount, setCanvasesCountState] = useState(1);
  const [layersCount, setLayersCountState] = useState(5);
  const [activeExportsCount, setActiveExportsCountState] = useState(0);

  const setCanvasesCount = useCallback((count: number) => {
    setCanvasesCountState(count);
  }, []);

  const setLayersCount = useCallback((count: number) => {
    setLayersCountState(count);
  }, []);

  const setActiveExportsCount = useCallback((count: number) => {
    setActiveExportsCountState(Math.max(0, count));
  }, []);

  const incrementActiveExports = useCallback(() => {
    setActiveExportsCountState(prev => prev + 1);
  }, []);

  const decrementActiveExports = useCallback(() => {
    setActiveExportsCountState(prev => Math.max(0, prev - 1));
  }, []);

  return (
    <ProjectMetricsContext.Provider
      value={{
        canvasesCount,
        layersCount,
        activeExportsCount,
        setCanvasesCount,
        setLayersCount,
        setActiveExportsCount,
        incrementActiveExports,
        decrementActiveExports,
      }}
    >
      {children}
    </ProjectMetricsContext.Provider>
  );
}

export function useProjectMetrics() {
  const context = useContext(ProjectMetricsContext);
  if (!context) {
    throw new Error('useProjectMetrics must be used within a ProjectMetricsProvider');
  }
  return context;
}
