import React, { useState, useCallback } from 'react';
import { useDrag } from 'react-dnd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import {
  CodeBracketIcon,
  EyeIcon,
  ShieldCheckIcon,
  BeakerIcon,
  DocumentTextIcon,
  RocketLaunchIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { addSkill, removeSkill, addAgent } from '../../store/slices/workflowSlice';
import type { Skill } from './workflowTypes';
import { PREDEFINED_SKILLS } from './workflowTypes';
import { i18nService } from '../../services/i18n';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  CodeBracketIcon,
  EyeIcon,
  ShieldCheckIcon,
  BeakerIcon,
  DocumentTextIcon,
  RocketLaunchIcon,
};

interface SkillPaletteProps {
  onSkillDragStart?: (skill: Skill) => void;
}

const SkillPalette: React.FC<SkillPaletteProps> = ({ onSkillDragStart: _onSkillDragStart }) => {
  const dispatch = useDispatch();
  const customSkills = useSelector((state: RootState) => state.workflow.skills);
  const agents = useSelector((state: RootState) => state.workflow.agents);
  const [newSkillName, setNewSkillName] = useState('');

  const handleAddCustomSkill = useCallback(() => {
    if (!newSkillName.trim()) return;

    const id = `custom-${Date.now()}`;
    const colors = ['#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899'];
    const newSkill: Skill = {
      id,
      name: newSkillName.trim(),
      color: colors[Math.floor(Math.random() * colors.length)],
      icon: 'CodeBracketIcon',
    };

    dispatch(addSkill(newSkill));
    setNewSkillName('');
  }, [newSkillName, dispatch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCustomSkill();
    }
  };

  const handleRemoveCustomSkill = useCallback((skillId: string) => {
    dispatch(removeSkill(skillId));
  }, [dispatch]);

  const handleAddAgent = useCallback(() => {
    const agentCount = agents.length + 1;
    dispatch(addAgent(`Agent ${agentCount}`));
  }, [agents, dispatch]);

  return (
    <div className="w-full h-full flex flex-col dark:bg-claude-darkSurface bg-claude-surface border-r dark:border-claude-darkBorder border-claude-border">
      {/* Header */}
      <div className="p-4 border-b dark:border-claude-darkBorder border-claude-border">
        <h2 className="text-sm font-semibold dark:text-claude-darkText text-claude-text">
          {i18nService.t('workflowTitle')}
        </h2>
      </div>

      {/* Skills Section */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4">
          <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            {i18nService.t('workflowAddSkill')}
          </h3>

          {/* Predefined Skills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {PREDEFINED_SKILLS.map((skill) => (
              <DraggableSkill
                key={skill.id}
                skill={skill}
              />
            ))}
          </div>

          {/* Custom Skills */}
          {customSkills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 pt-3 border-t dark:border-claude-darkBorder border-claude-border">
              {customSkills.map((skill) => (
                <div key={skill.id} className="relative group">
                  <DraggableSkill skill={skill} />
                  <button
                    onClick={() => handleRemoveCustomSkill(skill.id)}
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Custom Skill Input */}
          <div className="mt-3">
            <input
              type="text"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={i18nService.t('workflowCustomSkill')}
              className="w-full px-3 py-2 text-sm rounded-lg border dark:bg-claude-darkBg bg-claude-bg dark:border-claude-darkBorder border-claude-border dark:text-claude-darkText text-claude-text placeholder-gray-400 focus:outline-none focus:border-claude-accent"
            />
          </div>
        </div>
      </div>

      {/* Add Agent Button */}
      <div className="p-4 border-t dark:border-claude-darkBorder border-claude-border">
        <button
          onClick={handleAddAgent}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-claude-accent hover:bg-claude-accentHover text-white rounded-xl font-medium transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          {i18nService.t('workflowAddAgent')}
        </button>
      </div>
    </div>
  );
};

// Draggable Skill Component
interface DraggableSkillProps {
  skill: Skill;
}

const DraggableSkill: React.FC<DraggableSkillProps> = ({ skill }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'SKILL',
    item: skill,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [skill]);

  const IconComponent = ICON_MAP[skill.icon] || CodeBracketIcon;

  return (
    <div
      ref={drag}
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-white cursor-grab transition-all
        ${isDragging ? 'opacity-50 scale-95' : 'hover:scale-105'}
      `}
      style={{ backgroundColor: skill.color }}
    >
      <IconComponent className="w-3.5 h-3.5" />
      <span>{skill.name}</span>
    </div>
  );
};

export default SkillPalette;
