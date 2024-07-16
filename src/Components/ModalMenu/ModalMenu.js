import { itemsImages } from '../../assets/images';
import './ModalMenu.css';
function ModalMenu({ onClick, onContextMenu }) {
  const getImages = () => {
    const images = [];
    for (const [key] of Object.entries(itemsImages)) {
      images.push(
        <span
          key={key}
          onClick={() => {
            handleClick({ type: 'item', imageId: key });
          }}
        >
          <img className="image" src={itemsImages[key]} alt={key} />
        </span>
      );
    }
    return images;
  };

  const handleClick = (item) => {
    onClick(item);
  };
  const handleContextMenu = (e) => {
    e.preventDefault();
    onContextMenu();
  };
  return (
    <div className="wrapper" onContextMenu={handleContextMenu}>
      <div
        className={`square door`}
        onClick={() => {
          handleClick({ type: 'door' });
        }}
      ></div>
      <div
        className={`square check`}
        onClick={() => {
          handleClick({ type: 'check' });
        }}
      ></div>
      {getImages()}
    </div>
  );
}
export default ModalMenu;
