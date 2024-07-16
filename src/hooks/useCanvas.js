import { useEffect, useRef } from 'react';

function useCanvas(draw) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    updateCanvasSize(canvas, ctx);
    draw(ctx);
  }, [draw]);

  const updateCanvasSize = (canvas, context) => {
    const { width, height } = canvas.getBoundingClientRect();

    if (canvas.width !== width || canvas.height !== height) {
      const { devicePixelRatio: ratio = 1 } = window;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.scale(ratio, ratio);
      return true;
    }

    return false;
  };

  return canvasRef;
}

export default useCanvas;
