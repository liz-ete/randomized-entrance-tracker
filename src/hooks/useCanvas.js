import { useEffect, useRef } from 'react';

function useCanvas(draw) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    draw(ctx);
  }, [draw]);

  return canvasRef;
}

export default useCanvas;
