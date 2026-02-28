// Workflow Types

export interface Skill {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface WorkflowAgent {
  id: string;
  name: string;
  skills: Skill[];
  status: 'idle' | 'running' | 'completed' | 'error';
  position: { x: number; y: number };
  width?: number;
  height?: number;
  soulPrompt?: string; // Agent's system prompt / personality
}

export interface WorkflowConnection {
  id: string;
  sourceAgentId: string;
  targetAgentId: string;
  condition: string; // Natural language routing condition (e.g., "If tests fail, go back")
}

// Legacy type for backward compatibility
export type TriggerCondition = 'onComplete' | 'onError' | 'always';

export interface WorkflowState {
  agents: WorkflowAgent[];
  connections: WorkflowConnection[];
  skills: Skill[];
  isRunning: boolean;
  currentRunningAgentId: string | null;
}

// Predefined skills
export const PREDEFINED_SKILLS: Skill[] = [
  { id: 'code-writing', name: 'Code Writing', color: '#10B981', icon: 'CodeBracketIcon' },
  { id: 'code-review', name: 'Code Review', color: '#8B5CF6', icon: 'EyeIcon' },
  { id: 'audit', name: 'Audit', color: '#F59E0B', icon: 'ShieldCheckIcon' },
  { id: 'testing', name: 'Testing', color: '#EF4444', icon: 'BeakerIcon' },
  { id: 'documentation', name: 'Documentation', color: '#3B82F6', icon: 'DocumentTextIcon' },
  { id: 'deployment', name: 'Deployment', color: '#EC4899', icon: 'RocketLaunchIcon' },
];

// Color palette for agent avatars
export const AGENT_COLORS = [
  '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#3B82F6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1',
];
