import React, { useMemo, useCallback } from 'react';
import useLoadImages from '../../hooks/useLoadImages';
import './ModalMenu.css';

function ModalMenu({ onClick, onContextMenu }) {
  const { transformedImages, loading } = useLoadImages();

  const handleClick = useCallback((item) => onClick(item), [onClick]);

  const handleContextMenu = useCallback(
    (e) => {
      e.preventDefault();
      onContextMenu();
    },
    [onContextMenu]
  );

  const images = useMemo(() => {
    if (loading) return [];

    return Object.entries(transformedImages)
      .filter(([_, value]) => !['maps', 'others'].includes(value.type))
      .map(([key, value]) => (
        <span
          key={key}
          onClick={() =>
            handleClick({
              type: value.type,
              imageId: key,
              width: value.image.naturalWidth,
              height: value.image.naturalHeight,
            })
          }
        >
          <img className="image" src={value.image.src} alt={key} />
        </span>
      ));
  }, [transformedImages, loading, handleClick]);

  return (
    <div className="wrapper" onContextMenu={handleContextMenu}>
      <div
        className="square door"
        onClick={() => handleClick({ type: 'door' })}
      />
      <div
        className="square check"
        onClick={() => handleClick({ type: 'check' })}
      />
      {images}
    </div>
  );
}

export default ModalMenu;
