import React, { createContext, useContext, useState, useEffect } from 'react';
import { images } from '../assets/images';
const ImageContext = createContext();

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.onload = () => resolve(image);
    image.onerror = (error) =>
      reject(new Error(`Failed to load image: ${error}`));
  });
}

async function transformImages(obj, parentKey = null, result = {}) {
  const entries = Object.entries(obj);

  for (const [key, value] of entries) {
    if (value && typeof value === 'object') {
      await transformImages(value, key, result);
    } else if (typeof value === 'string') {
      try {
        const image = await loadImage(value);
        result[key] = { type: parentKey, image };
      } catch (error) {
        console.error(`Error loading image for key "${key}":`, error);
        result[key] = { type: parentKey, error: error.message };
      }
    } else {
      result[key] = { type: parentKey, value };
    }
  }

  return result;
}

export const ImageProvider = ({ children }) => {
  const [transformedImages, setTransformedImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const result = await transformImages(images);
        setTransformedImages(result);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  return (
    <ImageContext.Provider value={{ transformedImages, loading, error }}>
      {children}
    </ImageContext.Provider>
  );
};

export const useImageContext = () => useContext(ImageContext);
