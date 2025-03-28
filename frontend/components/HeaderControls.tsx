import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface HeaderControlsProps {
  onSave: () => void;
  onLockToggle: () => void;
  isLocked: boolean;
}

export interface HeaderControlsRef {
    toggleDrag: () => void;
  }

export interface Position {
x: number;
y: number;
}

  

const HeaderControls = forwardRef<HeaderControlsRef, HeaderControlsProps>(
  ({ onSave, onLockToggle, isLocked }, ref) => {
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
    } = useDraggable({
      id: 'header-controls',
    });

    useImperativeHandle(ref, () => ({
      toggleDrag: () => {
        // Lógica para alternar arrasto se necessário
      },
    }));

    const style: React.CSSProperties = {
        transform: CSS.Translate.toString({
          x: position.x + (transform?.x || 0),
          y: position.y + (transform?.y || 0),
          scaleX: transform?.scaleX ?? 1,
          scaleY: transform?.scaleY ?? 1,
        }),
        top: 16,
        left: 16,
        position: 'fixed',
        zIndex: 1000,
      };
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="header-controls"
      >
        <button onClick={onLockToggle}>
          {isLocked ? '🔓' : '🔒'}
        </button>
        <button onClick={onSave}>Gravar</button>
      </div>
    );
  }
);

HeaderControls.displayName = 'HeaderControls';
export default HeaderControls;