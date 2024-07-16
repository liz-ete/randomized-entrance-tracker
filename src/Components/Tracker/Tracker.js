import { useEffect, useMemo, useState } from 'react';
import {
  itemsImages,
  locationsImages,
  mapsImages,
  others,
} from '../../assets/images';
import { createPortal } from 'react-dom';
import ModalMenu from '../ModalMenu/ModalMenu';
import {
  lightWorldLocationsList,
  darkWorldLocationsList,
} from '../../Locations';
import useCanvas from '../../hooks/useCanvas';
import './Tracker.css';

function Tracker() {
  const [showMenu, setShowMenu] = useState(false);
  const [lightWorldLocations, setLightWorldLocations] = useState(
    lightWorldLocationsList
  );
  const [darkWorldLocations, setDarkWorldLocations] = useState(
    darkWorldLocationsList
  );
  const [mouseCoordinates, setMouseCoordinates] = useState();
  const [islightWorld, setIsLightWorld] = useState(false);
  const [loading, setLoading] = useState(true);
  const createImageList = () => {
    const imageList = [];
    const warp = new Image();
    warp.src = others.warp;
    imageList.push({ imageId: 'warp', image: warp, type: 'item' });
    for (const [key] of Object.entries(itemsImages)) {
      let newImage = new Image();
      newImage.src = itemsImages[key];
      imageList.push({ imageId: key, image: newImage, type: 'item' });
    }
    for (const [key] of Object.entries(locationsImages)) {
      let newImage = new Image();
      newImage.src = locationsImages[key];
      imageList.push({ imageId: key, image: newImage, type: 'location' });
    }
    // const warp = new Image();
    // imageList.push({ imageId: 'warp', image: warp, type: 'map' });
    for (const [key] of Object.entries(mapsImages)) {
      let newImage = new Image();
      newImage.src = mapsImages[key];
      imageList.push({ imageId: key, image: newImage, type: 'map' });
    }
    return imageList;
  };
  let imageArray = useMemo(createImageList, []);

  const preloadImages = async () => {
    await Promise.all(
      imageArray.map((item) => {
        return new Promise((resolve) =>
          item.image.addEventListener('load', () => {
            item.image.removeEventListener('load', () => {});
            resolve();
          })
        );
      })
    ).then(() => {
      setLoading(false);
    });
  };
  const WIDTH = 13;
  const HEIGHT = 13;
  const OFFSET = 1;
  let ctx;
  const draw = (context) => {
    ctx = context;
  };

  const canvasRef = useCanvas(draw);

  useEffect(() => {
    preloadImages();
  }, []);

  useEffect(() => {
    let background;
    let locations;
    if (islightWorld) {
      background = imageArray[imageArray.length - 2];
      locations = lightWorldLocations;
    } else {
      background = imageArray[imageArray.length - 1];
      locations = darkWorldLocations;
    }
    ctx.drawImage(background.image, 0, 0, ctx.canvas.width, ctx.canvas.height);
    locations.forEach((loc) => {
      const { x, y, imageId } = loc;

      if (imageId) {
        let imageToLoad = imageArray.find((img) => imageId === img.imageId);
        const { image } = imageToLoad;
        if (imageId === 'warp') {
          // ctx.drawImage(
          //   image,
          //   ctx.canvas.width - image.naturalWidth,
          //   ctx.canvas.height - image.naturalHeight,
          //   image.naturalWidth,
          //   image.naturalHeight
          // );
        } else {
          ctx.drawImage(image, x, y, image.naturalWidth, image.naturalHeight);
        }
      } else {
        ctx.fillStyle = '#000000';
        ctx.fillRect(x, y, WIDTH, HEIGHT);
        ctx.fillStyle = loc.isDoor ? '#FFD900' : '#1AFF00';
        ctx.fillRect(
          x + OFFSET,
          y + OFFSET,
          WIDTH - OFFSET * 2,
          HEIGHT - OFFSET * 2
        );
      }
    });
    // };
  }, [lightWorldLocations, darkWorldLocations, ctx, loading, islightWorld]);

  const handleContextClick = (e) => {
    e.preventDefault();
    setShowMenu(!showMenu);
    console.log(e.nativeEvent.clientX - 6, e.nativeEvent.clientY - 8);
    setMouseCoordinates({
      x: e.nativeEvent.clientX - 6,
      y: e.nativeEvent.clientY - 8,
    });
  };

  const handleClick = (e) => {
    // console.log(e.nativeEvent.clientX - 6, e.nativeEvent.clientY - 8);
  };

  const handleModalClick = (item) => {
    const { x, y } = mouseCoordinates;
    setShowMenu(false);
    let elementToAdd = {};
    if (item.type !== 'item') {
      elementToAdd = {
        x,
        y,
        isDoor: item.type === 'door',
      };
    } else {
      elementToAdd = {
        x,
        y,
        imageId: item.imageId,
      };
    }
    if (islightWorld) {
      setLightWorldLocations([...lightWorldLocations, elementToAdd]);
    } else {
      setDarkWorldLocations([...darkWorldLocations, elementToAdd]);
    }
  };
  const handleModalContextMenu = () => {
    setShowMenu(false);
  };

  const handleWarpClick = () => {
    setIsLightWorld(!islightWorld);
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width="519"
        height="519"
        onContextMenu={handleContextClick}
        onClick={handleClick}
        id="tracker"
      />
      {showMenu &&
        createPortal(
          <ModalMenu
            onClick={handleModalClick}
            onContextMenu={handleModalContextMenu}
          />,
          document.body
        )}
      {createPortal(
        <img
          src={others.warp}
          alt="warp"
          className="warp"
          onClick={handleWarpClick}
        ></img>,
        document.body
      )}
    </div>

    // {showMenu && createPortal(<div>Hola mundo</div>, 'tracker')}
  );
}

export default Tracker;
