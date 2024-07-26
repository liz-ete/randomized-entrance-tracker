import { useEffect, useState } from 'react';
import { images } from '../../assets/images';
import ModalMenu from '../ModalMenu/ModalMenu';
import {
  lightWorldLocationsList,
  darkWorldLocationsList,
} from '../../Locations';
import useCanvas from '../../hooks/useCanvas';
import './Tracker.css';
import useLoadImages from '../../hooks/useLoadImages';
import { FadeLoader } from 'react-spinners';
import UseNavigation from '../../hooks/useNavigation';
import Portal from '../Portal';

function Tracker() {
  const [showMenu, setShowMenu] = useState(false);
  const lightWorldLocalStorage = JSON.parse(
    localStorage.getItem('lightWorldLocations')
  );
  const darkWorldLocalStorage = JSON.parse(
    localStorage.getItem('darkWorldLocations')
  );
  const lightWorldData = lightWorldLocalStorage || lightWorldLocationsList;
  const darkWorldData = darkWorldLocalStorage || darkWorldLocationsList;
  const [lightWorldLocations, setLightWorldLocations] =
    useState(lightWorldData);
  const [darkWorldLocations, setDarkWorldLocations] = useState(darkWorldData);
  const [mouseCoordinates, setMouseCoordinates] = useState();
  const [islightWorld, setIsLightWorld] = useState(true);

  const { transformedImages, loading, error } = useLoadImages();
  const { closeWindow } = UseNavigation();

  const WIDTH = 13;
  const HEIGHT = 13;
  const OFFSET = 1;
  let ctx;
  const draw = (context) => {
    ctx = context;
  };

  const canvasRef = useCanvas(draw);

  useEffect(() => {
    if (loading || !ctx) return;

    const { background, locations } = islightWorld
      ? {
          background: transformedImages.lightWorld,
          locations: lightWorldLocations,
        }
      : {
          background: transformedImages.darkWorld,
          locations: darkWorldLocations,
        };

    if (islightWorld) {
      localStorage.setItem(
        'lightWorldLocations',
        JSON.stringify(lightWorldLocations)
      );
    } else {
      localStorage.setItem(
        'darkWorldLocations',
        JSON.stringify(darkWorldLocations)
      );
    }

    const drawBackground = () => {
      ctx.drawImage(
        background.image,
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height
      );
    };

    const drawLocation = (loc) => {
      const { x, y, imageId, type } = loc;
      if (imageId) {
        const { image } = transformedImages[imageId];
        ctx.drawImage(image, x, y, image.naturalWidth, image.naturalHeight);
      } else {
        ctx.fillStyle = '#000000';
        ctx.fillRect(x, y, WIDTH, HEIGHT);
        ctx.fillStyle = type === 'door' ? '#FFD900' : '#1AFF00';
        ctx.fillRect(
          x + OFFSET,
          y + OFFSET,
          WIDTH - OFFSET * 2,
          HEIGHT - OFFSET * 2
        );
      }
    };

    drawBackground();
    locations.forEach(drawLocation);
  }, [
    lightWorldLocations,
    darkWorldLocations,
    ctx,
    islightWorld,
    transformedImages,
    loading,
  ]);

  const handleContextClick = (e) => {
    e.preventDefault();

    
    const offset = { x: 6, y: 8 };
    const relativeCanvasPosition = e.target.getBoundingClientRect();
    const x = e.nativeEvent.clientX - relativeCanvasPosition.left - offset.x; //x position within the element.
    const y = e.nativeEvent.clientY - relativeCanvasPosition.top - offset.y;  //y position within the element.
    
    setShowMenu((prevShowMenu) => !prevShowMenu);
    setMouseCoordinates({ x, y });

    console.log(`Mouse coordinates: (${x}, ${y})`);
  };

  const handleClick = (e) => {
    const { clientX: x, clientY: y } = e.nativeEvent;
    const relativeCanvasPosition = e.target.getBoundingClientRect();
    const relativeX = x - relativeCanvasPosition.left; //x position within the element.
    const relativeY = y - relativeCanvasPosition.top;  //y position within the element.
    let filteredLocations = [];
    const locationsToModify = islightWorld
      ? [...lightWorldLocations]
      : [...darkWorldLocations];
    const itemToRemove = locationsToModify.findLastIndex((item) => {
      const width = item.width || WIDTH;
      const height = item.height || HEIGHT;
      return (
        item.x <= relativeX &&
        item.x + width >= relativeX &&
        item.y <= relativeY &&
        item.y + height >= relativeY
      );
    });

    if (itemToRemove === -1) return;

    filteredLocations = locationsToModify.toSpliced(itemToRemove, 1);

    if (islightWorld) {
      setLightWorldLocations(filteredLocations);
    } else {
      setDarkWorldLocations(filteredLocations);
    }
  };

  const handleModalClick = (item) => {
    const { x, y } = mouseCoordinates;

    const elementToAdd = {
      x,
      y,
      ...item,
    };

    const updateLocations = (prevLocations) => [...prevLocations, elementToAdd];

    setShowMenu(false);

    if (islightWorld) {
      setLightWorldLocations(updateLocations);
    } else {
      setDarkWorldLocations(updateLocations);
    }
  };

  const handleModalContextMenu = () => {
    setShowMenu(false);
  };

  const handleWarpClick = () => {
    setIsLightWorld(!islightWorld);
  };

  return (
    <div className="container">
      <FadeLoader
        loading={loading}
        color="gray"
        cssOverride={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        aria-label="Loading Spinner"
      />
      {error && closeWindow()}
      <canvas
        ref={canvasRef}
        width={519}
        height={519}
        onContextMenu={handleContextClick}
        onClick={handleClick}
        id="tracker"
      />
      {showMenu && (
        <Portal>
          <ModalMenu
            onClick={handleModalClick}
            onContextMenu={handleModalContextMenu}
          />
        </Portal>
      )}
      <Portal>
        <img
          src={images.others.warp}
          alt="Warp"
          className="warp"
          onClick={handleWarpClick}
          onContextMenu={(e) => {
            e.preventDefault();
          }}
        />
      </Portal>
    </div>
  );
}

export default Tracker;
