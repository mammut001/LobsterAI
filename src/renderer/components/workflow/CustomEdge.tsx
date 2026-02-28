import React, { useState, useRef, useEffect } from 'react';
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath, type EdgeProps } from '@xyflow/react';

export default function CustomEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    data,
}: EdgeProps) {
    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const condition = (data?.condition as string) || 'Always';
    const onChangeCondition = data?.onChangeCondition as ((condition: string) => void) | undefined;

    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(condition);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);
        setEditValue(condition);
    };

    const handleSubmit = () => {
        if (onChangeCondition && editValue.trim()) {
            onChangeCondition(editValue.trim());
        } else {
            setEditValue(condition);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        } else if (e.key === 'Escape') {
            setEditValue(condition);
            setIsEditing(false);
        }
    };

    const handleBlur = () => {
        handleSubmit();
    };

    // Get color based on condition keywords
    const getConditionColor = () => {
        const lower = condition.toLowerCase();
        if (lower.includes('error') || lower.includes('fail') || lower.includes('wrong')) {
            return '#EF4444'; // red
        }
        if (lower.includes('complete') || lower.includes('success')) {
            return '#8B5CF6'; // purple
        }
        return '#3B82F6'; // blue (default/always)
    };

    const edgeColor = getConditionColor();

    return (
        <>
            <BaseEdge
                path={edgePath}
                markerEnd={markerEnd}
                style={{ ...style, stroke: edgeColor, strokeWidth: 2 }}
                id={id}
            />
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        pointerEvents: 'all',
                    }}
                    className="nodrag nopan"
                >
                    {isEditing ? (
                        <input
                            ref={inputRef}
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                            className="nodrag nopan w-32 px-2 py-1 text-[10px] font-medium bg-claude-surface dark:bg-claude-darkSurface border-2 rounded-lg shadow-sm focus:outline-none"
                            style={{
                                borderColor: edgeColor,
                                color: edgeColor,
                            }}
                            placeholder="Condition..."
                        />
                    ) : (
                        <button
                            onClick={handleClick}
                            className="nodrag nopan px-2 py-1 bg-claude-surface dark:bg-claude-darkSurface border-2 text-[10px] font-medium rounded-lg shadow-sm cursor-pointer transition-all hover:scale-105 active:scale-95 max-w-[120px] truncate"
                            style={{
                                borderColor: edgeColor,
                                color: edgeColor,
                            }}
                            title={condition}
                        >
                            {condition}
                        </button>
                    )}
                </div>
            </EdgeLabelRenderer>
        </>
    );
}
