import { useCallback, useEffect, useRef } from 'react';

function useCanvas(draw) {
  const canvasRef = useRef(null);

  const updateCanvasSize = useCallback((canvas, context) => {
    const { width, height } = canvas.getBoundingClientRect();
    const { devicePixelRatio: ratio = 1 } = window;

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.scale(ratio, ratio);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    updateCanvasSize(canvas, ctx);
    draw(ctx);
  }, [draw, updateCanvasSize]);

  return canvasRef;
}

export default useCanvas;
