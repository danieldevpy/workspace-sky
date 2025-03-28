'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { IconButton, Popover, Box, Slider, Tooltip } from '@mui/material';
import { Brush, Visibility, VisibilityOff, Clear, Palette, Check } from '@mui/icons-material';

// Dynamically import Konva components to avoid SSR issues
const Stage = dynamic(() => import('react-konva').then((mod) => mod.Stage), { ssr: false });
const Layer = dynamic(() => import('react-konva').then((mod) => ({ default: mod.Layer })), { ssr: false });
const Line = dynamic(() => import('react-konva').then((mod) => ({ default: mod.Line })), { ssr: false });
const Rect = dynamic(() => import('react-konva').then((mod) => ({ default: mod.Rect })), { ssr: false });


interface LousaProps {
  active: boolean; // O pai controla se a lousa está ativa
}

const Lousa = ({ active }: LousaProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lines, setLines] = useState<any[]>([]);
  const [currentColor, setCurrentColor] = useState('#ff0000');
  const [brushSize, setBrushSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);
  const stageRef = useRef<any>(null);
  const [colorPickerAnchor, setColorPickerAnchor] = useState<HTMLElement | null>(null);
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseDown = (e: any) => {
    if (!active) return;
    setIsDrawing(true);
    setLines((prev) => [
      ...prev,
      { points: [], color: currentColor, brushSize, id: Date.now() }
    ]);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing || !active || !stageRef.current) return;
    const stage = stageRef.current;
    const point = stage.getPointerPosition();
    if (!point) return;

    setLines((prevLines) => {
      const newLines = [...prevLines];
      const lastLine = newLines[newLines.length - 1];

      if (lastLine) {
        lastLine.points = [...lastLine.points, point.x, point.y];
      }

      return newLines;
    });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => setLines([]);

  const handleColorChange = (color: string) => {
    setCurrentColor(color);
    setColorPickerAnchor(null);
  };

  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff9900', '#9900ff', '#ff0099', '#000000', '#ffffff', '#888888'];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        display: dimensions.width === 0 ? 'none' : 'block'
      }}
    >
      {/* Drawing Canvas */}
      <Stage
        width={dimensions.width}
        height={dimensions.height}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        ref={stageRef}
        style={{
          display: isVisible ? 'block' : 'none',
          backgroundColor: 'transparent'
        }}
      >
        <Layer>
          <Rect width={dimensions.width} height={dimensions.height} fill="transparent" listening={false} />
          {lines.map((line) => (
            <Line key={line.id} points={line.points} stroke={line.color} strokeWidth={line.brushSize} lineCap="round" lineJoin="round" />
          ))}
        </Layer>
      </Stage>

      {/* Floating Controls */}
      <div
        style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '12px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 10000
        }}
      >
        {/* Visibility Toggle */}
        <Tooltip title={isVisible ? 'Ocultar desenhos' : 'Mostrar desenhos'}>
          <IconButton onClick={() => setIsVisible(!isVisible)} color={isVisible ? 'primary' : 'default'}>
            {isVisible ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        </Tooltip>

        {/* Clear Canvas */}
        <Tooltip title="Limpar desenhos">
          <IconButton onClick={clearCanvas}>
            <Clear />
          </IconButton>
        </Tooltip>

        {/* Color Picker */}
        <Tooltip title="Selecionar cor">
          <IconButton onClick={(e) => setColorPickerAnchor(e.currentTarget)} sx={{ color: currentColor }}>
            <Palette />
          </IconButton>
        </Tooltip>

        {/* Brush Size */}
        <Box sx={{ width: 120, px: 1 }}>
          <Slider value={brushSize} min={1} max={20} onChange={(e, v) => setBrushSize(v as number)} valueLabelDisplay="auto" aria-label="Tamanho do pincel" />
        </Box>

        {/* Color Picker Popover */}
        <Popover open={Boolean(colorPickerAnchor)} anchorEl={colorPickerAnchor} onClose={() => setColorPickerAnchor(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Box p={2} display="flex" gap={1} flexWrap="wrap" width="200px">
            {colors.map((color) => (
              <div
                key={color}
                onClick={() => handleColorChange(color)}
                style={{ width: 30, height: 30, backgroundColor: color, borderRadius: '50%', cursor: 'pointer', border: color === currentColor ? '2px solid black' : 'none' }}
              >
                {color === currentColor && <Check style={{ color: color === '#ffffff' ? 'black' : 'white' }} />}
              </div>
            ))}
          </Box>
        </Popover>
      </div>
    </div>
  );
};

export default Lousa;
