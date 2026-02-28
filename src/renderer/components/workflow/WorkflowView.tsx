import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import SkillPalette from './SkillPalette';
import WorkflowCanvas from './WorkflowCanvas';
import { i18nService } from '../../services/i18n';
import SidebarToggleIcon from '../icons/SidebarToggleIcon';
import ComposeIcon from '../icons/ComposeIcon';
import WindowTitleBar from '../window/WindowTitleBar';

interface WorkflowViewProps {
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  onNewChat?: () => void;
}

const WorkflowView: React.FC<WorkflowViewProps> = ({
  isSidebarCollapsed,
  onToggleSidebar,
  onNewChat,
}) => {
  const isMac = window.electron.platform === 'darwin';

  return (
    <DndProvider backend={HTML5Backend}>
      <ReactFlowProvider>
        <div className="flex flex-col h-full">
          {/* Header - Draggable bar with title */}
          <div className="draggable flex h-12 items-center justify-between px-4 border-b dark:border-claude-darkBorder border-claude-border shrink-0">
            <div className="flex items-center space-x-3 h-8">
              {isSidebarCollapsed && (
                <div className={`non-draggable flex items-center gap-1 ${isMac ? 'pl-[68px]' : ''}`}>
                  <button
                    type="button"
                    onClick={onToggleSidebar}
                    className="h-8 w-8 inline-flex items-center justify-center rounded-lg dark:text-claude-darkTextSecondary text-claude-textSecondary hover:bg-claude-surfaceHover dark:hover:bg-claude-darkSurfaceHover transition-colors"
                  >
                    <SidebarToggleIcon className="h-4 w-4" isCollapsed={true} />
                  </button>
                  <button
                    type="button"
                    onClick={onNewChat}
                    className="h-8 w-8 inline-flex items-center justify-center rounded-lg dark:text-claude-darkTextSecondary text-claude-textSecondary hover:bg-claude-surfaceHover dark:hover:bg-claude-darkSurfaceHover transition-colors"
                  >
                    <ComposeIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
              <h1 className="text-lg font-semibold dark:text-claude-darkText text-claude-text">
                {i18nService.t('agentWorkflow')}
              </h1>
            </div>
            <WindowTitleBar inline />
          </div>

          {/* Main Content Area */}
          <div className="non-draggable flex flex-1 min-h-0">
            {/* Left Panel - Skill Palette (w-72 shrink-0, border-r) */}
            <div className="w-72 shrink-0 border-r dark:border-claude-darkBorder border-claude-border">
              <SkillPalette />
            </div>

            {/* Right Panel - ReactFlow Canvas (flex-1) */}
            <div className="non-draggable flex-1 min-w-0">
              <WorkflowCanvas />
            </div>
          </div>
        </div>
      </ReactFlowProvider>
    </DndProvider>
  );
};

export default WorkflowView;
