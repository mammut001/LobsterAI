import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { deleteSession as deleteSessionAction, updateSessionStatus } from '../../store/slices/coworkSlice';
import { coworkService } from '../../services/cowork';
import { i18nService } from '../../services/i18n';
import type { CoworkSessionSummary, CoworkSessionStatus } from '../../types/cowork';
import { TrashIcon, StopIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

interface AgentsPanelProps {
  onSelectSession?: (sessionId: string) => void;
  onNavigateHome?: () => void;
}

const statusColors: Record<CoworkSessionStatus, { bg: string; text: string; dot: string }> = {
  idle: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400', dot: 'bg-gray-500' },
  running: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', dot: 'bg-blue-500 animate-pulse' },
  completed: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', dot: 'bg-green-500' },
  error: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400', dot: 'bg-red-500' },
};

const AgentsPanel: React.FC<AgentsPanelProps> = ({ onSelectSession, onNavigateHome }) => {
  const dispatch = useDispatch();
  const sessions = useSelector((state: RootState) => state.cowork.sessions);
  const [loading, setLoading] = useState(true);

  // Load sessions on mount
  useEffect(() => {
    const loadSessions = async () => {
      try {
        await coworkService.loadSessions();
      } catch (error) {
        console.error('Failed to load sessions:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSessions();
  }, []);

  // Subscribe to language changes to refresh
  useEffect(() => {
    const unsubscribe = i18nService.subscribe(() => {
      // Force re-render on language change
    });
    return unsubscribe;
  }, []);

  // Filter to only show running agents by default
  const runningAgents = sessions.filter(s => s.status === 'running');
  const otherAgents = sessions.filter(s => s.status !== 'running');

  const handleViewSession = async (sessionId: string) => {
    await coworkService.loadSession(sessionId);
    onSelectSession?.(sessionId);
    onNavigateHome?.();
  };

  const handleStopSession = async (sessionId: string) => {
    await coworkService.stopSession(sessionId);
    dispatch(updateSessionStatus({ sessionId, status: 'idle' }));
  };

  const handleDeleteSession = async (sessionId: string) => {
    await coworkService.deleteSession(sessionId);
    dispatch(deleteSessionAction(sessionId));
  };

  const renderAgentItem = (session: CoworkSessionSummary) => {
    const colors = statusColors[session.status];
    const statusLabel = session.status === 'running' ? 'agentsRunning' :
                       session.status === 'idle' ? 'agentsIdle' :
                       session.status === 'completed' ? 'agentsCompleted' : 'agentsError';

    return (
      <div
        key={session.id}
        className="group flex items-center justify-between p-3 rounded-lg hover:bg-black/[0.04] dark:hover:bg-white/[0.05] transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
            <h3 className="text-sm font-medium dark:text-claude-darkText text-claude-text truncate">
              {session.title}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className={`px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
              {i18nService.t(statusLabel)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {session.status === 'running' && (
            <button
              onClick={(e) => { e.stopPropagation(); handleStopSession(session.id); }}
              className="p-1.5 rounded-lg hover:bg-claude-surfaceHover dark:hover:bg-claude-darkSurfaceHover text-claude-textSecondary"
              title={i18nService.t('agentsStopSession')}
            >
              <StopIcon className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); handleViewSession(session.id); }}
            className="p-1.5 rounded-lg hover:bg-claude-surfaceHover dark:hover:bg-claude-darkSurfaceHover text-claude-textSecondary"
            title={i18nService.t('agentsViewSession')}
          >
            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDeleteSession(session.id); }}
            className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500"
            title={i18nService.t('deleteSession')}
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-sm dark:text-claude-darkTextSecondary text-claude-textSecondary">
          {i18nService.t('loading')}
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm dark:text-claude-darkTextSecondary text-claude-textSecondary">
          {i18nService.t('agentsNoAgents')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Running Agents Section */}
      {runningAgents.length > 0 && (
        <div>
          <h3 className="text-xs font-medium uppercase tracking-wider dark:text-claude-darkTextSecondary text-claude-textSecondary mb-2 px-1">
            {i18nService.t('agentsRunning')} ({runningAgents.length})
          </h3>
          <div className="space-y-1">
            {runningAgents.map(renderAgentItem)}
          </div>
        </div>
      )}

      {/* Other Agents Section */}
      {otherAgents.length > 0 && (
        <div>
          <h3 className="text-xs font-medium uppercase tracking-wider dark:text-claude-darkTextSecondary text-claude-textSecondary mb-2 px-1">
            {i18nService.t('coworkHistory')} ({otherAgents.length})
          </h3>
          <div className="space-y-1">
            {otherAgents.map(renderAgentItem)}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentsPanel;
