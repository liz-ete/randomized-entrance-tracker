import { useImageContext } from '../contexts/imageContext';

const useLoadImages = () => {
  const context = useImageContext();
  if (!context) {
    throw new Error('useLoadImages must be used within an ImageProvider');
  }
  return context;
};

export default useLoadImages;
