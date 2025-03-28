import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableTabProps {
  id: string;
  children: React.ReactNode;
  onRemove: (id: string) => void;
}

const SortableTab: React.FC<SortableTabProps> = ({ id, children, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="sortable-tab"
    >
      {children}
      <button onClick={() => onRemove(id)}>🗑️</button>
    </div>
  );
};

export default SortableTab;